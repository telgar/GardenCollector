// Time
const MINUTE = 1000 * 60;
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24
const WEEK = DAY * 7

// Logging
const SAMPLE_RATE = 1000 * 60;
const LOG_LIMIT = DAY * 30;

// Soil Sensor
const DRY = 520;
const WET = 280;
const RANGE = DRY - WET;

module.exports = {
    // Logging
    SAMPLE_RATE: SAMPLE_RATE,
    LOG_LIMIT: LOG_LIMIT,
    // Soil Sensor
    DRY: DRY,
    WET: WET,
    RANGE: RANGE,
};