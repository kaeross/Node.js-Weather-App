const weather = require('./weather.js');
const bracklesham = 3764;
const locationInput = process.argv.splice(2);
weather.get(locationInput);