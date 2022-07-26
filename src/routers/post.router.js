const { PostController } = require('../controllers/post.controller');

const postRouter = (router) =>{

    router.get('/posts', (req, res) => PostController.postPost(req, res));
}

module.exports = postRouter;