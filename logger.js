const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

const constants = require('./constants');

const logDb = low(constants.LOG_DB_PATH, {
  storage: fileAsync
})
logDb.defaults({ logs: [] }).write()

const log = function() {

    for (let i = 0; i < arguments.length; i++) {
        
    }
    var args = [].slice.call(arguments);
    console.log(args);

    logDb.get('logs')
        .push({ timestamp: new Date(), log: args })
        .write()
}

module.exports = {
    log: log
};