const userController = require('../controllers/user.controller');

const userRouter = (router) =>{

    router.post('/login', userController.signIn);

}

module.exports = userRouter;