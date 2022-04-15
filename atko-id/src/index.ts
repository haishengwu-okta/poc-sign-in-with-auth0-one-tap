import express from "express";
import path from "path";
import fs from 'fs';
import cors from 'cors';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import https from 'https';
import { auth, requiresAuth } from 'express-openid-connect';

const app = express();
const port = 3000; // default port to listen

const poorManCache: Record<string, any> = {};

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'https://atko.id:3000',
  secret: 'very secret === ---',
  clientID: '19QWwZqmvAVS7qxfnb6nNE0Vmv8bQmMe',
  clientSecret: 'TkSS9vsPZS-MYGl3EJxb5pM_fSFf6YFp_LpLRGfbjeifat5zMSNswx9HSZ-Gmj8u',
  issuerBaseURL: 'https://hw-id.us.auth0.com',
  authorizationParams: {
    response_type: 'code',
  },
  // session: {
  //   cookie: {
  //     sameSite: 'None'
  //   }
  // }
};

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser());

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// define a route handler for the default home page
app.get("/", (req, res) => {
  let isLogin = false;
  let profile = '';
  if (req.oidc.isAuthenticated()) {
    isLogin = true;
    profile = JSON.stringify(req.oidc.user, null, 2);
    poorManCache[req.oidc.user.sub] = req.oidc.user;
    res.cookie(
      'sid',
      req.oidc.user.sub,
      {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }
    )
  }
  res.render("index", {
    isLogin,
    profile,
  });
});

const corsOpt = {
  "origin": "https://acme.health:8181",
  "methods": "GET",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  credentials: true,
};

app.get('/account', cors(corsOpt), (req, res) => {
  res.json({
    e: !!(req.cookies.sid)
  });
});
app.get('/iframe/select', cors(corsOpt), (req, res) => {
  const u = poorManCache[req.cookies.sid] || {};
  console.log((req.cookies.sid), u.email);
  res.render('iframe-select', {user: u});
  // res.send(`Hello ${u.name}! Continue as ${u.email}`);
});

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
https
  .createServer(
    {
    key: fs.readFileSync(__dirname + '/../cert/foo.key'),
    cert: fs.readFileSync(__dirname + '/../cert/foo.crt'),
  },
               app)
 .listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at https://localhost:${port}`);
});
