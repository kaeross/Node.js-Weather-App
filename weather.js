//Problem: Create a kitesurfing weather app
//solution use node.js to connect to magic seaweed api to retrieve tide times, wind forecast and weather forecast


const api = require('../api.json');
const key = api.key;

const http = require('http');
const https = require('https');

//print error messages
function printError(error, lineNumber) {
	console.error(`there has been an error at ${lineNumber} :` + error.message);
}

//function to convert unix timeStamp
function getDateTime(unix_timestamp) {
	const date = new Date(unix_timestamp*1000);
	//get year
	const year = date.getFullYear();
	//convert month to letters
	const months = ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
	const monthIndex = date.getMonth() -1;
	const formattedMonth = months[monthIndex];
	// Day from timestamp
	const day = date.getDate();
	// Hours part from the timestamp
	const hours = date.getHours();
	// Minutes part from the timestamp
	const minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	const seconds = "0" + date.getSeconds();
	// Will display time in 10:30 format
	const formattedTime = `At ${hours}:${minutes.substr(-2)} on ${day} ${formattedMonth} ${year} `;
	return formattedTime;
}

//print relevent weather data
function printWeather(jsondata) {
	const mphToKts = (mph) => {return Math.ceil(mph * 0.868976)};
	const timeStamp = jsondata.localTimestamp;
	const dateTime = getDateTime(timeStamp);
	const wind = jsondata.wind;
	const windSpeed = `${mphToKts(wind.speed)} kts`;
	const direction = wind.compassDirection;
	const gusts = `${mphToKts(wind.gusts)} kts`;
	console.log(`${dateTime} The wind speed will be ${windSpeed} gusting ${gusts}, ${direction} `);

}

//function to get weather profile by spot ID
function get(spotID) {
	const magicSeaweedAPI = `http://magicseaweed.com/api/${key}/forecast/?spot_id=${spotID}`;
	try {
		//connect to api url
		const request = http.get(magicSeaweedAPI, response => {
			console.log(response.statusCode);
			if (response.statusCode === 200) {
				let body = "";
				//read data
				response.on('data', data => {
					body += data.toString();
				});
				response.on('end', () => {	
					try {
						//parse data
						const weatherDataArray = JSON.parse(body);
						weatherDataArray.forEach((weatherData) => { printWeather(weatherData)});
					} catch (error) {
						printError(error, 49);
					}
				});
			} else {
				const message = `There was an error getting the profile for spot ID ${spotID} (${http.STATUS_CODES[response.statusCode]})`;
				const statusCodeError = new Error(message);
				printError(statusCodeError, 55);
			}
		});
	} catch (error) {
		printError(error, 59);
	}
}

module.exports.get = get;