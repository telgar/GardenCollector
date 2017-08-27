const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const _ = require('lodash')
const five = require("johnny-five");

const constants = require('./constants');
const logger = require('./logger');

function roundToClosest(number, closest) {

    return Math.round(number / closest * closest);
}

function wateringCheck(soilDbPath, relay) {

    // read last 10 samples, and if all are below the threshold then close relay
    try {
        let soilDb = low(soilDbPath, {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const logs = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(10)
            .map((o) => { return roundToClosest(o.moisture, 100) })
            .value()

        let allBelowThreshold = _.every(logs, function(log) {

            return log < constants.MOISTURE_THRESHOLD
        })

        if (allBelowThreshold) {

            logger.log('All logs below the threshold of ' + constants.MOISTURE_THRESHOLD + '% for "' + soilDbPath + '" , closing relay(' + relay.pin + ').')

            relay.close();

            logger.log ('Relay(' + relay.pin + ') closed.')

            logger.log('Waiting for '+ (constants.WATERING_TIME / 1000) + ' seconds...')

            var wateringTImeout = setTimeout(function() {

                relay.open();

                logger.log('Relay(' + relay.pin + ') opened.')          

            }, constants.WATERING_TIME)                      
        } else {
            logger.log('Not all logs below threshold of ' + constants.MOISTURE_THRESHOLD + '%, waiting ' + (constants.WATERING_CHECK_INTERVAL / 1000) + ' seconds...')
        }
    } catch (e) {
        logger.log(e)
    }
}

module.exports = {
    relays: {},
    init: function() {

        logger.log('Setting intial state: Opening relay(' + constants.RELAY1_PIN + ').')
        
        this.relays[constants.RELAY1_PIN] = new five.Relay({
            pin: constants.RELAY1_PIN
        });        
        
        this.relays[constants.RELAY1_PIN].open();
    },
    start: function() {
 
        var self = this;
        
        logger.log('Starting "' + constants.SOIL1_DB_PATH + '" trigger on a ' + (constants.WATERING_CHECK_INTERVAL / 1000) + ' second interval...');

        this.soil1Trigger = setInterval(
            function() { wateringCheck(constants.SOIL1_DB_PATH, self.relays[constants.RELAY1_PIN]) }, 
            constants.WATERING_CHECK_INTERVAL); 
    },
    stop: function() {

        logger.log('Stopping "' + constants.SOIL1_DB_PATH + '" trigger.');

        clearInterval(this.soil1Trigger);

        logger.log('Opening relay(' + constants.RELAY1_PIN + ').')

        this.relays[constants.RELAY1_PIN].open();
    }
}