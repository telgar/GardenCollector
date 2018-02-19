const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

const constants = require('./constants');

const logDb = low(constants.LOG_DB_PATH, {
  storage: fileAsync
})
logDb.defaults({ logs: [] }).write()

const log = function() {

    var args = [].slice.call(arguments);
    
    logDb.get('logs')
        .push({ timestamp: new Date(), log: args })
        .write()

    let oldestRecord = new Date().getTime() - constants.LOG_LIMIT
    
    logDb.get('logs')
      .remove((o) => new Date(o.timestamp).getTime() < oldestRecord)
      .write()
}

module.exports = {
    log: log
};