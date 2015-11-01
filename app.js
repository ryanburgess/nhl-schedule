var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');

app.get('/', function (req, res) {
  res.send('NHL Game Schedule API');
});
app.get('/api/', function (req, res) {
  var qr = req.query.date;
  var day;
  var newDate;
  var block = [];
  var games = [];

  if(qr !== undefined){
    newDate = qr;
  }else{
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    if(month <= 9){
      month = '0' + month;
    }
    var day = dateObj.getUTCDate();
    if(day <= 9){
      day = '0' + day;
    }
    var year = dateObj.getUTCFullYear().toString();

    newDate = year + month.toString() + day.toString();
  }
  

  request({
      method: 'GET',
      url: 'http://espn.go.com/nhl/schedule?date=' + newDate
  }, function(err, response, body, callback) {
    if (err) return console.error(err);
    $ = cheerio.load(body);

    $('table').each(function(key){
      var todaySchedule = $(this).find('tr');
      games = [];
      $(todaySchedule).each(function(key){
        if(!$(this).hasClass('colhead')){

          if($(this).hasClass('stathead')){
            day = $(this).children('td').eq(0).text();
          }

          var teams = $(this).children('td').eq(0).text();

          var homeAway = teams.split(' at ');
          var home = homeAway[1];
          var away = homeAway[0];

          var time = $(this).children('td').eq(1).text();
          if(teams !== 'TEAMS' && teams !== day){
            games.push({away: away, home: home, time: time, timezone: 'EST'});
          }
        }        
      });

      block.push({date: day, year: year, games: games});    
    })
    
    res.send(JSON.stringify(block, null, 4));

  });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on port ' + port);
});
