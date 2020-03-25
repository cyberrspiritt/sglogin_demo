var express = require('express');
var router = express.Router();

const restClient = require('superagent-bluebird-promise');
const path = require('path');
const _ = require('lodash');
const querystring = require('querystring');
const securityHelper = require('../lib/security/security');
const config = require('../config/config');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// ####################
// Setup Configuration
// ####################

var _sglogin_clientId = config.SGLOGIN_CLIENT_ID;
var _sglogin_redirect_uri = config.SGLOGIN_REDIRECT_URI;
var _sglogin_secretId = config.SGLOGIN_SECRET_ID;
var _sglogin_tokenApiUrl = config.SGLOGIN_TOKEN_API;
var _sglogin_host_domain = config.SGLOGIN_HOST_DOMAIN;
var _sglogin_signature_private_key = config.SGLOGIN_SIGNATURE_CERT_PRIVATE_KEY;
var _sglogin_signature_public_cert = config.SGLOGIN_SIGNATURE_CERT_PUBLIC_CERT;

// /* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../views/html/index.html'));
});

router.get('/callback', function (req, res, next){
    // get variables from frontend
    var code = req.query.code;
    var request;

    // **** CALL TOKEN API ****
    request = createTokenRequest(code);
    request
        .buffer(true)
        .end(function(callErr, callRes) {
            if (callErr) {
                // ERROR
                console.error("Token Call Error: ",callErr.status);
                console.error(callErr.response.req.res.text);
                res.jsonp({
                    status: "ERROR",
                    msg: callErr
                });
            } else {
                // SUCCESSFUL
                var data = {
                    body: callRes.body,
                    text: callRes.text
                };
                console.log("Response from Token API:".green);
                console.log(JSON.stringify(data.body));

                var encryptedData = data.body.id_token;
                var jweParts = encryptedData.split("."); // header.encryptedKey.iv.ciphertext.tag

                securityHelper.decryptJWE(jweParts[0], jweParts[1], jweParts[2], jweParts[3], jweParts[4], _sglogin_signature_private_key)
                    .then(personDataJWS => {
                        if (personDataJWS == undefined || personDataJWS == null) {
                            res.jsonp({
                                status: "ERROR",
                                msg: "INVALID DATA OR SIGNATURE FOR PERSON DATA"
                            });
                        }
                        console.log("Person Data (JWS):".green);
                        console.log(JSON.stringify(personDataJWS));

                        var decodedPersonData = securityHelper.verifyJWS(personDataJWS, _sglogin_signature_public_cert);
                        if (decodedPersonData == undefined || decodedPersonData == null) {
                            res.jsonp({
                                status: "ERROR",
                                msg: "INVALID DATA OR SIGNATURE FOR PERSON DATA"
                            })
                        }

                        console.log("Person Data (Decoded):".green);
                        console.log(JSON.stringify(decodedPersonData));

                        // // successful. return data back to frontend
                        res.jsonp({
                            status: "OK",
                            text: decodedPersonData
                        });

                    })
                    .catch(error => {
                        console.error("Error with decrypting JWE: %s".red, error);
                    })
            }
        });
});

function createTokenRequest(code) {
    var cacheCtl = "no-cache";
    var contentType = "application/x-www-form-urlencoded";
    var host = _sglogin_host_domain;

    // assemble params for Token API
    var strParams = "grant_type=authorization_code" +
        "&code=" + code +
        "&redirect_uri=" + _sglogin_redirect_uri +
        "&client_id=" + _sglogin_clientId +
        "&client_secret=" + _sglogin_secretId;
    var params = querystring.parse(strParams);


    // assemble headers for Token API
    var strHeaders = "Content-Type=" + contentType + "&Cache-Control=" + cacheCtl + "&Host=" + host;
    var headers = querystring.parse(strHeaders);

    console.log("Request Header for Token API:".green);
    console.log(JSON.stringify(headers));

    var request = restClient.post(_sglogin_tokenApiUrl);

    // Set headers
    if (!_.isUndefined(headers) && !_.isEmpty(headers))
        request.set(headers);

    // Set Params
    if (!_.isUndefined(params) && !_.isEmpty(params))
        request.send(params);

    return request;
}

module.exports = router;
