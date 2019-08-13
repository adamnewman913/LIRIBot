require("dotenv").config();



//vars
var keys = require("./keys");
var fs = require("fs");
var request = require("request");

//var Spotify = require('spotify-web-api-node');
var Spotify = require('node-spotify-api');
//creates log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
// for (var i = 4; i < process.argv.length; i++) {
//     secondCommand += '+' + process.argv[i];
// }

// Fetch Spotify Keys
var spotify = new Spotify(keys.spotify);

// Writes to the log.txt file
function getArtistNames() {
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          requestElement +
          "/events?app_id=codingbootcamp"
      )
      .then(function(response) {
        var result = response.data[0];
        var eventDate = moment(result.datetime).format("MM/DD/YYYY");
        resultData =
          "\n\nYou can find events information below:\n================================================\nName(s) of the venue: " +
          result.venue.name +
          "\n\nVenue location(s): " +
          result.venue.city +
          ", " +
          result.venue.region +
          ", " +
          result.venue.country +
          "\n\nDate(s) of the Event(s): " +
          eventDate +
          "\n\n================================================";
        console.log(resultData);
        dataLog();
      });
    }
//command: do-what-it-says
function doWhat() {
    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error);
        console.log(data.toString());
        //split text with comma delimiter
        var cmds = data.toString().split(',');
    });
}
// Function for running a Spotify search - Command is spotify-this-song
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists);
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

//Switch command
function mySwitch(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

      

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }

    

    //OMDB Movie - command: movie-this
    function getMovie() {
        var movieName = secondCommand;
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                //Simultaneously output to console and log.txt via NPM simple-node-logger
                console.log('================ Movie Info ================');
                console.log("Title: " + body.Title);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Country: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
                

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }
      
     



}   //Closes mySwitch func - Everything except the call must be within this scope

//Call mySwitch function
mySwitch(userCommand);