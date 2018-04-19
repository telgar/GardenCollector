// Time
const MINUTE = 1000 * 60;
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

// Logging
const SAMPLE_RATE = 1000 * 60;
const LOG_LIMIT = DAY * 14;

// Soil Sensor
const DRY1 = 520;
const WET1 = 280;
const RANGE1 = DRY1 - WET1;

const DRY2 = 510;
const WET2 = 270;
const RANGE2 = DRY2 - WET2;

const MIN_LAST_WATERED_THRESHOLD_HOURS = 22;
const MAX_LAST_WATERED_THRESHOLD_HOURS = 24;
const MOISTURE_THRESHOLD = 55;
const WATERING_TIME = 1000 * 55;
const WATERING_CHECK_INTERVAL = 1000 * 60 * 5;

// Temperature Sensor
const BAD_READING_THRESHOLD = 50;

// DB Paths
const LOG_DB_PATH = '../logs.json';
const TEMPERATURE_DB_PATH = '../temperature.json';
const SOIL1_DB_PATH = '../soil1.json';
const SOIL2_DB_PATH = '../soil2.json';
const WATERING_DB_PATH = '../watering.json';

// Pins
const TEMPERATURE_SENSOR_PIN = 7;
const SOIL1_SENSOR_PIN = "A0";
const SOIL2_SENSOR_PIN = "A1";
const RELAY1_PIN = 4;
const RELAY2_PIN = 5;

module.exports = {
    // Logging
    SAMPLE_RATE: SAMPLE_RATE,
    LOG_LIMIT: LOG_LIMIT,
    // Soil Sensor
    DRY1: DRY1,
    WET1: WET1,
    RANGE1: RANGE1,
    DRY2: DRY2,
    WET2: WET2,
    RANGE2: RANGE2,
    // Watering
    MIN_LAST_WATERED_THRESHOLD_HOURS: MIN_LAST_WATERED_THRESHOLD_HOURS,
    MAX_LAST_WATERED_THRESHOLD_HOURS: MAX_LAST_WATERED_THRESHOLD_HOURS,
    MOISTURE_THRESHOLD: MOISTURE_THRESHOLD,
    WATERING_TIME: WATERING_TIME,
    WATERING_CHECK_INTERVAL: WATERING_CHECK_INTERVAL,
    // Temperature Sensor
    BAD_READING_THRESHOLD,
    // DB Paths
    LOG_DB_PATH: LOG_DB_PATH,
    TEMPERATURE_DB_PATH: TEMPERATURE_DB_PATH,
    SOIL1_DB_PATH: SOIL1_DB_PATH,
    SOIL2_DB_PATH: SOIL2_DB_PATH,
    WATERING_DB_PATH: WATERING_DB_PATH,
    // Pins
    TEMPERATURE_SENSOR_PIN: TEMPERATURE_SENSOR_PIN,
    SOIL1_SENSOR_PIN: SOIL1_SENSOR_PIN,
    SOIL2_SENSOR_PIN: SOIL2_SENSOR_PIN,
    RELAY1_PIN: RELAY1_PIN,
    RELAY2_PIN: RELAY2_PIN
};
