const constants = require('./constants');

// calculate the % soil humidity from raw readings
var humidityPerc = function(reading) {
  
  if (reading > constants.DRY) { 
    console.log('Dryer than dry! Reading = ' + reading)
  }

  if (reading < constants.WET) {
    console.log('Wetter than wet! Reading = ' + reading)
  }

  return (constants.DRY - reading) / constants.RANGE * 100;
}

module.exports = {
    humidityPerc: humidityPerc
};