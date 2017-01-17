var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res) {

    var options = {
        url: 'https://xap.ix-io.net/api/v1/my_project_n1OWkqND/airports/JFK',
        headers: {
            'Authorization': process.env.AUTH_KEY,
            'Accept': 'application/json'
        }
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.send(data);
        }

    });
});

app.post('/post', function(req, res) {
    console.log('req body: ', req.body);
    var options = {
        url: 'https://xap.ix-io.net/api/v1/my_project_n1OWkqND/airports/' + req.body.text,
        headers: {
            'Authorization': process.env.AUTH_KEY,
            'Accept': 'application/json'
        }
    };

    console.log(options);

    request(options, function(error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            var resBody = {
                response_type: "in_channel",
                text: body
            };
            res.send(resBody);
        } else if (error) {
            res.send(error);
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
