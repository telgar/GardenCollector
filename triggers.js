const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const _ = require('lodash')
const five = require("johnny-five");

const constants = require('./constants');
const logger = require('./logger');
const waterRepo = require('./waterRepo');

function roundToClosest(number, closest) {

    return Math.round(number / closest * closest);
}

function wateringCheck(relay) {

    // read last 10 samples, and if all are below the threshold then close relay
    try {
        let soilDb1 = low(constants.SOIL1_DB_PATH, {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const logs1 = soilDb1.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(10)
            .map((o) => { return roundToClosest(o.moisture, 100) })
            .value()

        let allBelowThreshold1 = _.every(logs1, function(log) { return log < constants.MOISTURE_THRESHOLD })

        let soilDb2 = low(constants.SOIL2_DB_PATH, {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const logs2 = soilDb2.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(10)
            .map((o) => { return roundToClosest(o.moisture, 100) })
            .value()

        let allBelowThreshold2 = _.every(logs2, function(log) { return log < constants.MOISTURE_THRESHOLD })

        let lastWatered = waterRepo.lastLog();

        let tooSoonToWater = true;
        let tooLongSinceWater = false;
        
        if (lastWatered != null) {
            logger.log('Last watered: ' + lastWatered)

            let hoursSinceLastWater = (new Date().getTime() - lastWatered.getTime()) / 1000 / 60 / 60
            
            logger.log('Last watered: ' + hoursSinceLastWater + ' hours ago.')

            if (hoursSinceLastWater > constants.MAX_LAST_WATERED_THRESHOLD_HOURS) {
                tooLongSinceWater = true;
                logger.log('Last watered: Setting tooLongSinceWater to true')
            } else {
                tooLongSinceWater = false;
                logger.log('Last watered: Setting tooLongSinceWater to false')
            }

            if (hoursSinceLastWater < constants.MIN_LAST_WATERED_THRESHOLD_HOURS) {
                tooSoonToWater = false;
                logger.log('Last watered: Setting tooSoonToWater to false')
            } else {
                tooSoonToWater = true;
                logger.log('Last watered: Setting tooSoonToWater to true')
            }
        }

        let itsWateringTime = tooLongSinceWater || (!tooSoonToWater && allBelowThreshold1 && allBelowThreshold2)

        if (itsWateringTime) {

            //logger.log('All logs below the threshold of ' + constants.MOISTURE_THRESHOLD + '%, closing relay(' + relay.pin + ').')

            relay.close();
            
            logger.log('Watering for '+ (constants.WATERING_TIME / 1000) + ' seconds...')
            waterRepo.log();

            var wateringTImeout = setTimeout(function() { relay.open(); }, constants.WATERING_TIME)                      
        } else {
            if (allBelowThreshold1) {
                logger.log('Only soil sensor 1 below the threshold.')
            } else if (allBelowThreshold2) {
                logger.log('Only soil sensor 2 below the threshold.')
            }
        }
    } catch (e) {
        logger.log(e)
    }
}

module.exports = {    
    relays: {},
    init: function() {   

        this.relays[constants.RELAY1_PIN] = new five.Relay({
            pin: constants.RELAY1_PIN
        });        
        
        this.relays[constants.RELAY1_PIN].open();
    },
    start: function() {
 
        var self = this;
        
        logger.log('Starting trigger on a ' + (constants.WATERING_CHECK_INTERVAL / 1000) + ' second interval...');

        this.soilTrigger = setInterval(
            function() { wateringCheck(self.relays[constants.RELAY1_PIN]) }, 
            constants.WATERING_CHECK_INTERVAL); 
    },
    stop: function() {

        logger.log('Stopping trigger.');

        clearInterval(this.soilTrigger);        

        this.relays[constants.RELAY1_PIN].open();
    }
}