const userController = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');

const userRouter = (router) =>{

    router.post('/login', userController.logIn);
    router.post('/signup', userController.signUp);
    router.get('/auto-login', jwtMiddleware, userController.autoLogin);

}

module.exports = userRouter;