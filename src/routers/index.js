const express  = require("express");
const router = express.Router();

// const userRouter = require('./user.router');
const postRouter = require('./post.router');
const commentRouter = require('./comment.router');

module.exports = () => {
    
    postRouter(router);
    commentRouter(router);

    return router;
}
