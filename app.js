const path = require('path');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');

const requestTimer = require('./middleware/requestTimer');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const store = require('./lib/store');

function createApp() {
  const app = express();

  // Credentials come from environment variables, never from source code
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  let ADMIN_PASS = process.env.ADMIN_PASS;
  if (!ADMIN_PASS) {
    ADMIN_PASS = crypto.randomBytes(6).toString('hex');
    console.log(`ADMIN_PASS not set. Temporary admin password for this run: ${ADMIN_PASS}`);
  }
  app.locals.config = { ADMIN_USER, ADMIN_PASS };

  // Template engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('trust proxy', 1);

  // Third-party middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan('dev'));
  app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(16).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 1000 },
  }));

  // Custom middleware
  app.use(requestTimer);

  // Built-in middleware
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(express.static(path.join(__dirname, 'public')));

  // Make session user available in every view
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.path = req.path;
    next();
  });

  // Routers
  app.get('/', async (req, res) => {
    const list = await store.readAll();
    res.render('index', { title: 'Home', count: list.length });
  });
  app.use('/', require('./routes/auth'));
  app.use('/students', require('./routes/students'));
  app.use('/api', require('./routes/api'));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
