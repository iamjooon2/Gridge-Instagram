const userController = require('../controllers/user.controller');

const userRouter = (router) =>{

    router.post('/login', userController.logIn);
    router.post('/signup', userController.signUp);

}

module.exports = userRouter;