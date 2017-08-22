//Problem: Create a kitesurfing weather app
//solution use node.js to connect to magic seaweed api to retrieve tide times, wind forecast and weather forecast

const bracklesham = 3764;
const api = require('../api.json');
const key = api.key;

const http = require('http');
const https = require('https');

//print error messages
function printError(error, lineNumber) {
	console.error(`there has been an error at ${lineNumber} :` + error.message);
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
						const weatherData = JSON.parse(body);
						//print data
					} catch (error) {
						printError(error, 32);
					}
				});
			} else {
				const message = `There was an error getting the profile for spot ID ${spotID} (${http.STATUS_CODES[response.statusCode]})`;
				const statusCodeError = new Error(message);
				printError(statusCodeError, 38);
			}
		});
	} catch (error) {
		printError(error, 43);
	}
}

get(bracklesham);