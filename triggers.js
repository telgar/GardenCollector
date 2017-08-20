const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const _ = require('lodash')
const five = require("johnny-five");

const constants = require('./constants');

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

            console.log('All logs below the threshold for "' + soilDbPath + '" , closing relay(' + relay.pin + ').')

            relay.close();

            console.log ('Relay(' + relay.pin + + ') closed.')

            console.log('Waiting for '+ (constants.WATERING_TIME / 1000) + ' seconds...')

            var wateringTImeout = setTimeout(function() {

                relay.open();

                console.log('Relay(' + relay.pin + ') opened.')          

            }, constants.WATERING_TIME)

                      
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    relays: {},
    init: function() {

        console.log('Setting intial state: Opening relay(' + constants.RELAY1_PIN + ').')
        
        this.relays[constants.RELAY1_PIN] = new five.Relay({
            pin: constants.RELAY1_PIN
        });        
        
        this.relays[constants.RELAY1_PIN].open();
    },
    start: function() {
 
        var self = this;
        
        console.log('Starting "' + constants.SOIL1_DB_PATH + '" trigger on a ' + (constants.WATERING_CHECK_INTERVAL / 1000) + ' second interval...');

        this.soil1Trigger = setInterval(
            function() { wateringCheck(constants.SOIL1_DB_PATH, self.relays[constants.RELAY1_PIN]) }, 
            constants.WATERING_CHECK_INTERVAL); 
    },
    stop: function() {

        console.log('Stopping "' + constants.SOIL1_DB_PATH + '" trigger.');

        clearInterval(this.soil1Trigger);

        console.log('Opening relay(' + constants.RELAY1_PIN + ').')

        //openRelay(constants.RELAY1_PIN);
        this.relays[constants.RELAY1_PIN].open();
    }
}