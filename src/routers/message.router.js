const messageController = require('../controllers/message.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');

const messageRouter = (router) =>{

    // 메시지 전송 API
    router.post('/message', jwtMiddleware, messageController.postMessage);
    
    // 메시지 수신 API
    router.get('/message', jwtMiddleware, messageController.getMessages);
}

module.exports = messageRouter;