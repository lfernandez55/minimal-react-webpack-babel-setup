// server.js — Node 22+ ESM, no Babel

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

import { passport } from './src/javascripts/config/passport.js';
import { APP_TITLE } from './src/javascripts/config/vars.js';
import { configureRoutes } from './src/javascripts/config/routes.js';

// __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database ---------------------------------------------------------------
mongoose
  .connect(process.env.db_string, {})
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.error('Error connecting:', err);
  });

// --- App --------------------------------------------------------------------
export const app = express();

// App locals
app.locals.title = app.locals.appTitle = APP_TITLE;


// Sessions + Passport
app.use(
  session({
    name: 'expressSession',
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me', // move to env in prod
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true } // add secure:true when behind HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Simple logger
app.use('/', function (req, res, next) {
  console.log(req.url);
  next();
});

// Views and static
app.set('views', path.join(__dirname, 'src', 'javascripts', 'views'));
app.set('view engine', 'ejs');

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
configureRoutes(app);

// --- HTTP server ------------------------------------------------------------
const server = http.createServer(app);
const PORT = process.env.PORT || '8080';

server.listen(PORT);
server.on('error', (err) => {
  throw err;
});
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? address : address.port;
  console.log('Listening on ' + bind);
});
