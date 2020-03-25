# SGLogin Demo App

This is a demo application meant to illustrate how to integrate your application with SGLogin

## Changelog

**25 Mar 2020:**
  - Initial Base Setup


## SGLogin App Setup

### 1.1 Install Node and NPM

In order for the demo application to run, you will need to install Node and NPM.

Follow the instructions given by the links below depending on your OS.

- [Install Node and NPM for Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
- [Install Node and NPM for Linux](http://blog.teamtreehouse.com/install-node-js-npm-linux)
- [nstall Node and NPM for Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac)


### 1.2 Run NPM install

Run the following command in the folder you unzipped the application:
```
npm install
```

### 1.3 Configurations

**For Linux/MacOS/Windows**

Edit the ``config/config.js``. Look for place where ``env`` is defined. Set it to staging/production

```
    //@Todo: Enter the following configs as received/submitted from/to SGLogin
    "SGLOGIN_CLIENT_ID": '', //enter your approved client id
    "SGLOGIN_SECRET_ID": "", //enter the secret id received from SGLogin
    "SGLOGIN_REDIRECT_URI": "", //enter the approved Redirect URI
    "SGLOGIN_TOKEN_API": "", //enter the provided token api url here
    "SGLOGIN_HOST_DOMAIN": "", //enter the approved callback host domain
    "SGLOGIN_SIGNATURE_CERT_PRIVATE_KEY": "./visitor_certs/sglogin_stage/your_private_key.key", //Save your private key here
    "SGLOGIN_SIGNATURE_CERT_PUBLIC_CERT": "./visitor_certs/sglogin_stage/stg-auth-signing-public.cer", //Save the signing cert received from SGLOGIN here
```

Go to ``views/html/index.html`` and look for ``@Todo`` and update the values as mentioned in the ``config/config.php``


### 1.4 Start the Application

**For Linux/MacOS/Windows**

Make sure you've reviewed all the ``@Todo`` found in the code and updated them as mentioned. Execute the following command to start the application from the root of this project:
```
  node bin/www
```

**Access the Application on Your Browser**

You should be able to access the sample application via the following URL:

```
    http://localhost:3001
```

**To make the system run on Production**

You would require to setup and additional npm module ``forever`` to make the app run in the background using the following command

```
    npm install -g forever
```

Then run the script (while you're in the root of the project) in the background as

```
    forever start bin/www
```
