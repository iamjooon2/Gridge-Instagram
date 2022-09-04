const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "GridgeTestChallenge",
        description: "그릿지테스트챌린지 Swagger API",
    },
    host: "localhost:5001",
    schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
    "../src/index.js",
    "../src/router/*.router.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);