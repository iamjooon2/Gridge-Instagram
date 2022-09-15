const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info :{
            title: "GridgeTestChallenge",
            version: "1.0.0",
            description: "그릿지테스트챌린지 API"
        },
        servers: [
            {
              url: "http://localhost:3000/docs", // url
              description: "Local server", // name
            },
        ]
    },
    apis: ["./router/*.js" ,"./controller/*.js", "./swagger/swagger.js"],
    };
  
  module.exports = options;