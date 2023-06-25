const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let { getGoogleAdsData } = require('./src/services/getGoogleAds')

// Middleware to parse request body
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.post('/v14/customers/:customerId/googleAds:search', async (req, res) => {
    let response = {}
    const customerId = req.params.customerId;
    if (customerId == "2386293921") {
        response = await getGoogleAdsData(req, res);
        res.status(200).send(response);
    } else {
        response = {
            "error": {
                "code": 401,
                "message": "invalid customer Id",
                "status": "NOTSUPPORTED"
            }
        }
        res.status(401).send(response)
    }

    console.log(res.statusCode)
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on PORT ${port}....`))