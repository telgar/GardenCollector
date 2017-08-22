const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const five = require("johnny-five");

const constants = require('./constants');
const formatters = require('./formatters');
const trigger = require('./triggers');
const logger = require('./logger');

// Start database using file-async storage, and initialize
const tempDb = low(constants.TEMPERATURE_DB_PATH, {
  storage: fileAsync
})
tempDb.defaults({ temperature: [] }).write()

const soild1Db = low(constants.SOIL1_DB_PATH, {
  storage: fileAsync
})
soild1Db.defaults({ soil: [] }).write()

const soild2Db = low(constants.SOIL2_DB_PATH, {
  storage: fileAsync
})
soild2Db.defaults({ soil: [] }).write()

const board = new five.Board({
  repl: false
});

// Read from Arduino
board.on("ready", function() {

  logger.log('Arduino is ready. Sampling every ' + (constants.SAMPLE_RATE / 1000) + ' seconds.')

  // Temperature
  var thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: constants.TEMPERATURE_SENSOR_PIN,
    freq: constants.SAMPLE_RATE
  });

  thermometer.on("data", function() {
       
    if (this.celsius < constants.BAD_READING_THRESHOLD) {    
      tempDb.get('temperature')
        .push({ timestamp: new Date(), celsius: this.celsius })
        .write()
    }

    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    tempDb.get('temperature')
      .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
      .write()    
  });

  // Soil moisture 1
  var soil1Humidity = new five.Sensor({
    pin: constants.SOIL1_SENSOR_PIN,
    freq: constants.SAMPLE_RATE
  });

  soil1Humidity.on("data", function() {

    soild1Db.get('soil')
      .push({ 
        timestamp: new Date(), 
        moisture: formatters.humidityPerc(this.value, constants.DRY1, constants.WET1, constants.RANGE1) })
      .write()

    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    soild1Db.get('soil')
      .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
      .write()
  });

  // Soil moisture 2
  var soil2Humidity = new five.Sensor({
    pin: constants.SOIL2_SENSOR_PIN,
    freq: constants.SAMPLE_RATE
  });

  soil2Humidity.on("data", function() {

    soild2Db.get('soil')
      .push({ 
        timestamp: new Date(), 
        moisture: formatters.humidityPerc(this.value, constants.DRY2, constants.WET2, constants.RANGE2) })
      .write()

    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    soild2Db.get('soil')
      .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
      .write()
  });

  trigger.init();
  trigger.start();
});

board.on("exit", function() {

  trigger.stop();
});