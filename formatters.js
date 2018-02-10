const logger = require('./logger');

// calculate the % soil humidity from raw readings
var humidityPerc = function(reading, dryLimit, wetLimit, rangeLimit) {
  
  if (reading > dryLimit) { 
    //logger.log('Formatters: Dryer than dry! Reading = ' + reading)
  }

  if (reading < wetLimit) {
    //logger.log('Formatters: Wetter than wet! Reading = ' + reading)
  }

  return (dryLimit - reading) / rangeLimit * 100;;
}

module.exports = {
    humidityPerc: humidityPerc
};