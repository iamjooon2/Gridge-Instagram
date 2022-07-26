const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const compression = require('compression');

const { swaggerUi, specs } = require("../swagger/swagger")

const { pool } = require('./assets/db');

const {SERVER_HOST, SERVER_PORT} = process.env;

const server = () => {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(compression());

    const Router = require('./routers/index.js');
    app.use('/api', Router());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.listen(SERVER_PORT, () => {
        console.log(`GridgeTestServer is now listening to http://${SERVER_HOST}:${SERVER_PORT}`);
    })
    
};

try {
    server(SERVER_PORT);
} catch (e) {
    console.log(e);
}