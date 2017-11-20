const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

const constants = require('./constants');

const wateringDb = low(constants.WATERING_DB_PATH, {
    storage: fileAsync
  })
wateringDb.defaults({ logs: [] }).write()

const log = function() {
    
    wateringDb.get('logs')
        .push({ timestamp: new Date() })
        .write()
    
    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    wateringDb.get('logs')
        .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
        .write()
}

const lastLog = function() {

    let result = wateringDb.get('logs')
        .sortBy(['timestamp'])
        .reverse()
        .take(1)
        .map((o) => { return new Date(o.timestamp) })
        .value()

    if (result != undefined && result.length == 1) {
        return new Date(result[0])
    }

    return null;
}

module.exports = {
    log: log,
    lastLog: lastLog
};