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

    // 게시글 좋아요 API
    router.post('/posts/:postIdx/like', jwtMiddleware, postController.postPostLike);

    // 게시글 좋아요 취소 API
    router.patch('/posts/:postIdx/like', jwtMiddleware, postController.postPostDislike);

    // 게시글 신고 API
    router.post('/posts/:postIdx/report', jwtMiddleware, postController.postPostReport);
}

module.exports = postRouter;