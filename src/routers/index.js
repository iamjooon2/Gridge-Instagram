const express  = require("express");
const router = express.Router();

// const userRouter = require('./user.router');
const postRouter = require('./post.router');
const commentRouter = require('./comment.router');
const userRouter = require("./user.router");
const messageRouter = require("./message.router");

module.exports = () => {
    
    postRouter(router);
    userRouter(router);
    commentRouter(router);
    messageRouter(router);
    
    return router;
}
