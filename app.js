const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

const five = require("johnny-five");

const constants = require('./constants');
const formatters = require('./formatters');

// Start database using file-async storage, and initialize
const db = low('../data.json', {
  storage: fileAsync
})
db.defaults({ temperature: [], soil: [], humidity: [] })
  .write()

const board = new five.Board({
  repl: false
});

// Read from Arduino
board.on("ready", function() {

  // Temperature
  var thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 7,
    freq: constants.SAMPLE_RATE
  });

  thermometer.on("data", function() {
       
    db.get('temperature')
      .push({ timestamp: new Date(), celsius: this.celsius })
      .write()

    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    db.get('temperature')
      .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
      .write()    
  });

  // Soil moisture
  var soilHumidity = new five.Sensor({
    pin: "A0",
    freq: constants.SAMPLE_RATE
  });

  soilHumidity.on("data", function() {

    db.get('soil')
      .push({ timestamp: new Date(), moisture: formatters.humidityPerc(this.value) })
      .write()

    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    db.get('soil')
      .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
      .write()
  });

  // TODO: Air humidity
 
});