const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const axios = require('axios');

const countryRouter = express.Router();
countryRouter.use(bodyParser.json());

countryRouter.route('/:countryName')
.options((req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {

        var coronaData = {};
        const baseURL = 'https://www.worldometers.info/coronavirus/country';
        axios.get(baseURL + req.url)
            .then((response) => {
                if (response.status === 200) {

                    const $ = cheerio.load(response.data);

                    const totalCases = Number($('div:contains("Coronavirus Cases:") > div > span').text().trim().replace(/,/g, ''));
                    const deaths = Number($('div:contains("Deaths:") > div > span').text().trim().replace(/,/g, ''));
                    const recovered = Number($('div:contains("Recovered:") > div > span').text().trim().replace(/,/g, ''));
                    const activeCases = totalCases - (deaths + recovered);

                    coronaData = {
                        "Coronavirus Cases": totalCases.toString(),
                        "Deaths": deaths.toString(),
                        "Recovered": recovered.toString(),
                        "Active Cases": activeCases.toString(),
                    };
                    console.log(coronaData);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(coronaData);
                }
                else {
                    var err = new Error('Wrong Country name!!');
                    res.statusCode = response.status;
                    next(err);
                }
            })
            .catch((err) => console.log(err))

    });

module.exports = countryRouter;