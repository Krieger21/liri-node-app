require("dotenv").config();
var inquirer = require("inquirer");
var request = require('request')
var imports = require('./keys');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var fs = require('fs')

var spotify = new Spotify(imports.spotify);
var client = new Twitter(imports.twitter);

inquirer.prompt([
    {
        type: "list",
        message: "What do you want to do?",
        choices: ["Show my tweets!", "Spotify a song!", "Look up a movie!", "Do what it says!"],
        name: "options"
    }
]).then(function (inquirerResponse) {

    if (inquirerResponse.options === "Show my tweets!") {
        console.log("YOUR RECENT TWEETS: \n")
        tweeter()
        
    }

    else if (inquirerResponse.options === "Spotify a song!") {

        inquirer.prompt([
            {
                type: "input",
                message: "What song would you like to spotify?",
                name: "song"
            }
        ]).then(function (response) {
            if (response.song === "") {
                var input = "Ace of Base"
                console.log("SONG INFO: \n")
                spotified(input)  
               }
               else {
                   var input = response.song
                   console.log("SONG INFO: \n")
                   spotified(input)
               }
            
        })
    }

    else if (inquirerResponse.options === "Look up a movie!") {
         inquirer.prompt([
            {
                type: "input",
                message: "What movie would you like to look up?",
                name: "movie"
            }
        ]).then(function (inquirer) {
            if (inquirer.movie === "") {
             var input = "Mr.Nobody"
             console.log("MOVIE INFO: \n")
             omdb(input)  
            }
            else {
                var input = inquirer.movie
                console.log("MOVIE INFO: \n")
                omdb(input)
            }
        })
    }

    else if (inquirerResponse.options === "Do what it says!") {
        
        fs.readFile('./random.txt', 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            var ya = data.slice(19, 37)
            var input = ya
            spotified(input)
          });
    }

})

function spotified (input) {
    
    spotify.search({ type: "track", query: input, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data)
        
        // console.log("\nArtist: " + data.tracks.items[0].artists[0].name +
        //             "\nThe song's name: " + data.tracks.items[0].name +
        //             "\nPreview on spotify: " + data.tracks.items[0].external_urls.spotify +
        //             "\nAlbum name: " + data.tracks.items[0].album.name + "\n");
        
    });
}

function omdb(input) {
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body) {

        if (err) {
            return console.log("This is bullshit: " + err)
        }
    
        console.log("The movie's release year is: " + body);
    
    })
}


function tweeter() {

    var params = {
        screen_name: 'jimlehey16',
        count: 20,
        trim_user: true
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets[0].created_at)
            console.log(tweets[0].text);
        }
    });
}

