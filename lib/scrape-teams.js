var cheerio = require('cheerio');
var request = require('request');
var outputFilename = './teams.json';
var fs = require('fs');
var teams = [];
request({
    method: 'GET',
    url: 'http://www.nhl.com/ice/teams.htm'
}, function(err, response, body, callback) {
  if (err) return console.error(err);
  $ = cheerio.load(body);

  $('.teamCard').each(function(key){
    var teamName = $(this).find('.teamCommon').text();
    var teamPlace = $(this).find('.teamPlace').text();
    teams.push({name: teamName, city: teamPlace});
  });

  fs.writeFile(outputFilename, JSON.stringify(teams, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('JSON saved to ' + outputFilename);
    }
  }); 
});