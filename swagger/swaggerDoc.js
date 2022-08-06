const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info :{
            title: "GridgeTestChallenge API",
            version: "1.0.0",
            description: "그릿지테스트챌린지 Swagger API"
        },
        host: 'http://localhost:5050',
        basepath: '/',
    },
    apis: ["./routers/*.js" ,"./controllers/*.js"],
};

module.exports = options;