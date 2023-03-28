const express = require('express');
var request = require('request');
const emailRoutes = express.Router();

emailRoutes.route('/api/email').post(async function (_req, res) {
    console.log(JSON.stringify(_req.body));
    var ingredients = "";

    var headers = { 
        'Content-Type' : 'application/json' 
    };
    
    let requestBody = {
        user_id: 'CKPf6a-vRVld3WhrB',
        service_id: 'service_0md784v',
        template_id: 'template_wb8qh4i',
        accessToken: super_secret_key,
        template_params: {
            'ingredients': ingredients
        }
    };

    console.log(ingredients);

    // await request.post({ 
    //     url: 'https://api.emailjs.com/api/v1.0/email/send',
    //     body: JSON.stringify(requestBody),
    //     headers: headers
    // },
    // function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         console.log(body);
    //     }
    // }
    //);
})

module.exports = emailRoutes;