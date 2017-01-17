const express = require('express');
const app = express();
const url = require('url');
const request = require('request');
const rp = require('request-promise');
const _ = require('lodash');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Constants
const baseURL = 'https://xap.ix-io.net/api/v1';
const airportBaseURL = baseURL + '/my_project_n1OWkqND/airports/';
const uberBaseURL = baseURL + '/uber/products_by_coordinates';
const xapxi_headers = {
    'Authorization': process.env.AUTH_KEY,
    'Accept': 'application/json'
};

app.set('port', (process.env.PORT || 9001));

//Just a test function - will not do anything with actual slack commands
app.get('/', function(req, res) {
    let options = {
        url: airportBaseURL + _.toUpper('dca'),
        headers: xapxi_headers
    };
    rp(options)
        .then(response => {
            return setUpUberReq(response);
        })
        .then(response => {
            var response_new = parseUberResp(response);
            return res.send(response_new);
        })
        .catch(err => res.send('Airport not found.')) // Don't forget to catch errors
});

app.post('/post', function(req, res) {
    console.log('req body: ', req.body);
    let options = {
        url: airportBaseURL + _.toUpper(req.body.text),
        headers: xapxi_headers
    };

    rp(options)
        .then(response => {
            return setUpUberReq(response);
        })
        .then(response => {
            // var response_new = parseUberResp(response);
            var resBody = {
                        response_type: "in_channel",
                        text: parseUberResp(response)
                    };
            return res.send(resBody);
        })
        .catch(err => res.send('Airport not found.')) // Don't forget to catch errors

    // request(options, function(error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         var data = JSON.parse(body);
    //
    //         var resBody = {
    //             response_type: "in_channel",
    //             text: body
    //         };
    //
    //         res.send(resBody);
    //     } else if (error) {
    //         res.send(error);
    //     }
    // });
});

function setUpUberReq(airportResp) {
    const airportdata = JSON.parse(airportResp);
    let options = {
        url: uberBaseURL,
        headers: xapxi_headers,
        qs: {
            'filter[latitude]': airportdata.airport.latitude,
            'filter[longitude]': airportdata.airport.longitude
        }
    };
    return rp(options)
}

function parseUberResp(uberResp) {
    const uberdata = JSON.parse(uberResp);
    if (uberdata.products_by_coordinates) {
        return createUberServicesList(uberdata);
    } else {
        return 'There are no services available at this location.';
    }
}

function createUberServicesList(uberdata) {
    let uberList = "The following uber services are available: ";
    _.forEach(uberdata.products_by_coordinates, product => {
        uberList = uberList + product.display_name + ', ';
    });
    return _.trimEnd(uberList, ', ');
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
