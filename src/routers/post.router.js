const postController = require('../controllers/post.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');

const postRouter = (router) =>{

    // 게시글 업로드 API
    router.post('/posts', jwtMiddleware, postController.postPost);

    // 게시글 목록 조회 API
    router.get('/posts/:userIdx', postController.getPosts);

    // 게시글 글 조회 API
    router.get('/posts/:postIdx/content', postController.getPostContent);

    // 게시글 수정 API
    router.patch('/posts/:postIdx', jwtMiddleware, postController.patchPost);
    
    // 게시글 삭제 API
    router.patch('/posts/:postIdx/status', jwtMiddleware, postController.patchPostStatus);
}

module.exports = postRouter;