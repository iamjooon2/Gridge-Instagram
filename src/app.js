const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const compression = require('compression');
const Router = require('./router/index.js');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require("../swagger/swagger-output");

const { SERVER_HOST, SERVER_PORT } = process.env;

const SERVICE_NAME = `GridgeTestServer`;

class Server {

    constructor(){
        this.app = express();
        this.setRoute();
        this.setMiddleware();
    }

    setRoute(){
        this.app.use('/api', Router());
    }

    setMiddleware(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(compression());

        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile), express.json());
    }
    
    listen(){
        this.app.listen(SERVER_PORT);
    }
}


const init = (SERVICE_NAME, SERVER_HOST, SERVER_PORT) =>{
    const server = new Server();
    server.listen(SERVER_PORT);

    const message = `${SERVICE_NAME} is now listening to http://${SERVER_HOST}:${SERVER_PORT}`;
    const wrapCharacter = `@`.repeat(message.length);

    console.log(wrapCharacter);
    console.log(message);
    console.log(wrapCharacter);
}

try {
    init(SERVICE_NAME, SERVER_HOST, SERVER_PORT);
} catch (e) {
    console.log(e);
}