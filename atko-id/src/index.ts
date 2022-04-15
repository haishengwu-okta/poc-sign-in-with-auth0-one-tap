import express from "express";
import path from "path";
import axios from 'axios';
import { auth, requiresAuth } from 'express-openid-connect';

const app = express();
const port = 3000; // default port to listen

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  secret: 'very secret === ---',
  clientID: '19QWwZqmvAVS7qxfnb6nNE0Vmv8bQmMe',
  clientSecret: 'TkSS9vsPZS-MYGl3EJxb5pM_fSFf6YFp_LpLRGfbjeifat5zMSNswx9HSZ-Gmj8u',
  issuerBaseURL: 'https://hw-id.us.auth0.com',
  authorizationParams: {
    response_type: 'code',
  }
  // tokenEndpointParams: {
  //   realm: 'email'
  // }
};

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// define a route handler for the default home page
app.get("/", (req, res) => {
  let isLogin = false;
  let profile = '';
  if (req.oidc.isAuthenticated()) {
    isLogin = true;
    profile = JSON.stringify(req.oidc.user, null, 2);
  }
  res.render("index", {
    isLogin,
    profile,
  });
});

// "client_id": "JbxwyH4VXJFJm8caGT9ik5LY1r6t6MGq",
app.get("/email", (req, res) => {
  axios.post(`${config.issuerBaseURL}/passwordless/start`, {
    "client_id": config.clientID,
    "client_secret": config.clientSecret,
    "connection": "email",
    "email": "freizl1@gmail.com", // set for connection=email
    "send": "link",
    "authParams": {
      "response_type": "code",
      "scope": "openid profile email",
      "state": "YOUR_STATE"
    }
  });
  res.send('success');
});


// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
