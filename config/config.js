var config;
var env = "staging"; //set your environment here

if(env === "staging"){
    config = {

        //@Todo: Enter the following configs as received/submitted from/to SGLogin
        "SGLOGIN_CLIENT_ID": '', //enter your approved client id
        "SGLOGIN_SECRET_ID": "", //enter the secret id received from SGLogin
        "SGLOGIN_REDIRECT_URI": "", //enter the approved Redirect URI
        "SGLOGIN_TOKEN_API": "", //enter the provided token api url here
        "SGLOGIN_HOST_DOMAIN": "", //enter the approved callback host domain
        "SGLOGIN_SIGNATURE_CERT_PRIVATE_KEY": "./visitor_certs/sglogin_stage/your_private_key.key", //Save your private key here
        "SGLOGIN_SIGNATURE_CERT_PUBLIC_CERT": "./visitor_certs/sglogin_stage/stg-auth-signing-public.cer", //Save the signing cert received from SGLOGIN here
    }
}  else if (env === "production"){
    config = {
        //@Todo: Enter the following configs as received/submitted from/to SGLogin
        "SGLOGIN_CLIENT_ID": '', //enter your approved client id
        "SGLOGIN_SECRET_ID": "", //enter the secret id received from SGLogin
        "SGLOGIN_REDIRECT_URI": "", //enter the approved Redirect URI
        "SGLOGIN_TOKEN_API": "", //enter the provided token api url here
        "SGLOGIN_HOST_DOMAIN": "", //enter the approved callback host domain
        "SGLOGIN_SIGNATURE_CERT_PRIVATE_KEY": "./visitor_certs/sglogin_prod/your_private_key.key", //Save your private key here
        "SGLOGIN_SIGNATURE_CERT_PUBLIC_CERT": "./visitor_certs/sglogin_prod/auth-signing-public.cer", //Save the signing cert received from SGLOGIN here
    }
}

module.exports = config;
