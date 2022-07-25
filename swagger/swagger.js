const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition : {
        openai: "3.0.0",
        info: {
            version: "1.0.0",
            title: "GridgeTestChallenge",
            description: "컴공선배 그릿지테스트 Restful API"
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
    },
    apis: [] // 추후 파일 연동
}

const specs = swaggereJsdoc(options);

module.exports = {swaggerUi, specs};