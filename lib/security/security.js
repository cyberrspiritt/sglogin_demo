const fs = require('fs');
const jwt = require('jsonwebtoken');
const jose = require('node-jose');

var security = {};

// Verify & Decode JWS or JWT
security.verifyJWS = function verifyJWS(jws, publicCert) {
    // verify token
    // ignore notbefore check because it gives errors sometimes if the call is too fast.
    try {
        var decoded = jwt.verify(jws, fs.readFileSync(publicCert, 'utf8'), {
            algorithms: ['RS256'],
            ignoreNotBefore: true
        });
        return decoded;
    } catch (error) {
        console.error("Error with verifying and decoding JWS: %s".red, error);
        throw ("Error with verifying and decoding JWS");
    }
}

// Decrypt JWE using private key
security.decryptJWE = function decryptJWE(header, encryptedKey, iv, cipherText, tag, privateKey) {
    console.log("Decrypting JWE".green + " (Format: " + "header".red + "." + "encryptedKey".cyan + "." + "iv".green + "." + "cipherText".magenta + "." + "tag".yellow + ")");
    console.log(header.red + "." + encryptedKey.cyan + "." + iv.green + "." + cipherText.magenta + "." + tag.yellow);
    return new Promise((resolve, reject) => {

        var keystore = jose.JWK.createKeyStore();

        console.log(Buffer.from(header, 'base64').toString());

        var data = {
            "type": "compact",
            "ciphertext": cipherText,
            "protected": header,
            "encrypted_key": encryptedKey,
            "tag": tag,
            "iv": iv,
            "header": JSON.parse(jose.util.base64url.decode(header).toString())
        };
        keystore.add(fs.readFileSync(privateKey, 'utf8'), "pem")
            .then(function(jweKey) {
                // {result} is a jose.JWK.Key
                jose.JWE.createDecrypt(jweKey)
                    .decrypt(data)
                    .then(function(result) {
                        resolve(result.payload.toString());
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });

    })
        .catch (error => {
            console.error("Error with decrypting JWE: %s".red, error);
            throw "Error with decrypting JWE";
        })
}

module.exports = security;
