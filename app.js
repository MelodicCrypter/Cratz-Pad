// Local App Modules
import './config/config';
import homeRoute from './routes/home-route';
import logger from './util/logger-util';

// Library Modules
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const es6Renderer = require('express-es6-template-engine');

// Set up
const app = express();
const port = process.env.PORT;
const publicAssetsPath = path.join(__dirname, './public/dist/');
const logsPath = path.join(__dirname, './log/');

// View: Template engine
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

// Middlewares ======================> Security
app.use(cors({ origin: false })); // Cross-Origin Resource Sharing is disabled
app.use(helmet()); // Helmet, for security of HTTP requests
// some Security middlewares require to be parsed first
app.use(express.json({ limit: '300kb' })); // Parser for JSON, with limit to avoid payload
app.use(express.urlencoded()); // Parser for x-www-form-urlencoded
// Middlewares ======================> Security continuation...
app.use(hpp()); // protection against Parameter Pollution attacks
// Middlewares ======================> Other
app.use(express.static(publicAssetsPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, pathz) => {
        res.setHeader('Cache-Control', 'max-age=31536000');
    },
}));
app.use(logger(`${logsPath}/app-logs.json`)); // Logs, using Winston & Express-Winston

// Main routes using express.Router()
app.use('/', homeRoute);

// Ready
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);

    // Browser-Refresh
    // Comment this out before building for Production
    // This is only for development, to auto refresh the browser
    // if (process.send) {
    //     process.send('online');
    // }
});
