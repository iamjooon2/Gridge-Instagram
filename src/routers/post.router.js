const postController = require('../controllers/post.controller');

const postRouter = (router) =>{

    router.post('/posts', postController.postPost);
}

module.exports = postRouter;