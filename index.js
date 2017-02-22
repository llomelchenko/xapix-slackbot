const express = require('express');
const app = express();

const rp = require('request-promise');
const _ = require('lodash');
const moment = require('moment');
moment().format();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Constants
const xapix_auth_key = process.env.AUTH_KEY || require('./token.js');
const baseURL = 'https://xap.ix-io.net/api/v1';
const airportBaseURL = baseURL + '/my_project_trUN0hXK/airports/';
const uberBaseURL = baseURL + '/uber/time_estimates';
const xapix_headers = {
    'Authorization': xapix_auth_key,
    'Accept': 'application/json'
};

app.set('port', (process.env.PORT || 9001));

//Just a test function - will not do anything with actual slack commands
app.get('/', function(req, res) {
    let options = {
        url: airportBaseURL + _.toUpper('jfk'),
        headers: xapix_headers
    };
    rp(options)
        .then(response => {
            return setUpUberReq(response);
        })
        .then(response => {
            var response_new = parseUberResp(response);
            return res.send(response_new);
        })
        .catch(err => {
            res.send('Airport not found.');
        })
});

app.post('/post', function(req, res) {
    console.log('req body: ', req.body);
    let options = {
        url: airportBaseURL + _.toUpper(req.body.text),
        headers: xapix_headers
    };

    rp(options)
        .then(response => {
            return setUpUberReq(response);
        })
        .then(response => {
            var resBody = {
                response_type: "in_channel",
                text: parseUberResp(response)
            };
            return res.send(resBody);
        })
        .catch(err => res.send('Airport not found.'))
});

function setUpUberReq(airportResp) {
    const airportdata = JSON.parse(airportResp);
    let options = {
        url: uberBaseURL,
        headers: xapix_headers,
        qs: {
            'filter[lat]': airportdata.airport.position_latitude,
            'filter[lon]': airportdata.airport.position_longitude
        }
    };
    return rp(options)
}

function parseUberResp(uberResp) {
    const uberdata = JSON.parse(uberResp);
    if (uberdata.time_estimates) {
        return createUberServicesList(uberdata);
    } else {
        return 'There are no services available at this location.';
    }
}

function createUberServicesList(uberdata) {
    let uberList = "The following uber services are available: ";
    _.forEach(uberdata.time_estimates, product => {
        uberList = uberList + product.display_name + ' ('+getMinutesDisplay(product.estimate)+'), ';
    });
    console.log(_.trimEnd(uberList, ', '))
    return _.trimEnd(uberList, ', ');
}

function getMinutesDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    return minutes + ' minutes';
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
