'use strict';

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const env = process.env.NODE_ENV || 'development';

const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'xmithd-website',
    host: process.env.APP_HOST || '0.0.0.0',
    port: 3000,
    protocol: 'http',
  },
  production: {
    port: process.env.APP_PORT || 3001,
  },
  development: {
  },
  test: {
    port: 3002,
  },
};

const config = Object.assign(configs.base, configs[env]);

module.exports = config;
