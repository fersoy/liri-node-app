require("dotenv").config();
var keys = require('./keys.js');
var Ticketmaster = require("ticketMaster");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var request = require('request');
var isToday = require('date-fns/is_today')
isToday(new Date());
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var ticketMaster = new Ticketmaster(keys.ticketMaster);

someThing(process.argv[2], process.argv[3], process.argv[4]);

function someThing(param1, param2) {
    switch (param1) {
        case 'spotify-this-song':
        case 'sts':
            if (param2 === "") {
                param2 = 'Rolling in the Deep';
            }
            spotify.search({
                type: 'track',
                query: param2
            }, function (err, data) {
                if (err) {
                    return printThis('Error occurred: ' + err);
                }
                printThis("By: " + data.tracks.items[0].album.artists[0].name);

                printThis("Song: " + param2);
                printThis("Play: " + data.tracks.items[0].external_urls.spotify);
                printThis("Album: " + data.tracks.items[0].album.name);

            });
            break;
        case 'movie-this':
        case 'mt':
            if (param2 === "") {
                param2 = 'The Godfather';
            }
            param2 = param2.replace(/ /g, '+');
            var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t='" + param2 + "'";
            // console.log(queryURL);
            request.get(queryURL, {
                json: true
            }, function (err, res, body) {
                //                console.log (body);
                if (!err && res.statusCode === 200) {
                    printThis(param2.replace(/\+/g, ' '));
                    //                console.log (body.Released);
                    let curDate = body.Released.split(' ');
                    printThis('Year released: ' + curDate[2]);
                    //                console.log ('Year released: ' + moment(body.Released).format("YYYY"));
                    printThis('Rating: ' + body.Rated);
                    for (let i = 0; i < body.Ratings.length; i++) {
                        if (body.Ratings[i].Source === 'Rotten Tomatoes') {
                            printThis('Rotten Tomatoes: ' + body.Ratings[i].Value);
                            break;
                        }
                    }
                    printThis('Title of the movie: ' + body.title);
                    printThis('Year the movie came out: ' + body.year);
                    printThis('IMDB Rating of the movie: ' + body.ratings);
                    printThis('Rotten Tomatoes Rating of the movie: ' + body.rotten);
                    printThis('Country produced: ' + body.Country);
                    printThis('Language: ' + body.Language);
                    printThis('Plot: ' + body.Plot);
                    printThis('Actors: ' + body.Actors);
                }
                if (err) {
                    printThis("OMDb error: " + err);
                }
            });
            break;
        case 'do-what-it-says':
        case 'dw':
            fs.readFile("./random.txt", "utf8", function (error, someText) {
                let text = someText.split(',');
                text[1].trim();
                someThing(text[0], text[1]);
            });
            break;
    }
}