// IMDB Bulk Lookup
// By Simon Raik-Allen and Andy Gee

var fs = require('fs');
var https = require('https');

var SEND_PAUSE = 500; // time to wait between sending lookup requests

var csvfile = Date.now() + "-results.csv";
var headings = ["Title", "Year", "imdbID", "Genre", "Rated", "Released", "Runtime", "Director", "Writer", "Actors", "Plot", "Language", "Country", "Awards", "Poster", "Metascore", "imdbRating", "imdbVotes", "Type", "DVD", "BoxOffice", "Production", "Website", "Response"];
fs.appendFileSync(csvfile, headings.join(","));

var options = {
	host: 'www.omdbapi.com'
};

var API_KEY = process.argv[3]; // https://www.omdbapi.com/  FREE! (1,000 daily limit)

if (!API_KEY) {
	console.log("Usage: node " + process.argv[1] + " <filename> <omdb api key>")
	process.exit(1);
}
var fileName = process.argv[2];

// Get the movie names from file
var movieNames;
try {
	movieNames = fs.readFileSync(fileName).toString().split("\n");
} catch (e) {
	console.log(e.message);
	process.exit(1);
}

// step through the list
function processMovieName(i) {
	if (i >= movieNames.length)
		return;

	if (!movieNames[i].indexOf("\t")) { // if no tab then try to find year inside ()
		var pos = movieNames[i].lastIndexOf("(");
		if (pos) {
			movieNames[i] = movieNames[i].slice(0, pos) + "\t" + movieNames[i].slice(pos + 1);
		}
	}

	var parts = movieNames[i].split("\t"); // format, [title][tab][year] or just [title]

	options.path = false;

	if (parts[0].length) { // check title length isn't empty
		options.path = "/?apikey=" + API_KEY + "&t=" + encodeURIComponent(parts[0]);
		if (parts.length == 2) { // look for year
			parts[1] = parseInt(parts[1].replace(/[^0-9]+/g, ""));

			if (parts[1] > 1000 && parts[1] < 3000) { // check year is between 1000 and 3000
				options.path = "/?apikey=" + API_KEY + "&t=" + encodeURIComponent(parts[0]) + "&y=" + parts[1];
			}
		}
	}

	if (options.path) {
		// console.log(options);
		// ask IMDB to search for the title
		https.get(options, processResponse(movieNames[i])).on('error', function (e) {
			console.log('ERROR: ' + movieNames[i] + "::" + e.message);
		});

		// pause a little before sending so we don't blow the API throttling limit
		setTimeout(next(i + 1), SEND_PAUSE);

	}

}

function next(i) {
	var i = i;
	return function () {

		processMovieName(i);
	}
}

function processResponse(name) {
	var movieName = name;

	return function (response) {
		if (response.statusCode == 200) {
			var body = '';
			response.on('data', function (chunk) {
				body += chunk;
			});
			response.on('end', function () {
				body = JSON.parse(body);
				var columns = [];

				headings.forEach((heading, index) => {
					if (body[heading] && body[heading].length) {
						// console.log(heading,body[heading]);
						columns.push('"' + body[heading].replace(/"/g, '\"') + '"');
					} else {
						columns.push('');
					}
				});

				if (columns.length) {
					fs.appendFileSync(csvfile, columns.join(",") + "\r\n");
					console.log(name, body.imdbRating);
				}

			});
		} else {
			console.log("ERROR: " + response.statusCode);
		}
	}
}

// start
processMovieName(0);