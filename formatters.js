// calculate the % soil humidity from raw readings
var humidityPerc = function(reading, dryLimit, wetLimit, rangeLimit) {
  
  if (reading > dryLimit) { 
    console.log('Dryer than dry! Reading = ' + reading)
  }

  if (reading < wetLimit) {
    console.log('Wetter than wet! Reading = ' + reading)
  }

  var percMoisture = (dryLimit - reading) / rangeLimit * 100;

  //console.log("Raw reading: " + reading + " dry: " + dryLimit + " wet: " + wetLimit + " range: " + rangeLimit + " perc: " + percMoisture);
  
  return percMoisture;
}

module.exports = {
    humidityPerc: humidityPerc
};