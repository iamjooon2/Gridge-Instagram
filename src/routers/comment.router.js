const commentController = require('../controllers/comment.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');

const commentRouter = (router) =>{

    // 댓글 업로드 API
    router.post('/comment', jwtMiddleware, commentController.postComment);

    // 댓글 조회 API
    router.get('/comment/:postIdx', commentController.getComments);

    // 댓글 수정 API
    router.patch('/comment/:commentIdx', jwtMiddleware, commentController.patchComment);
    
    // 댓글 삭제 API
    router.patch('/comment/:commentIdx/status', jwtMiddleware, commentController.patchCommentStatus);
}

module.exports = commentRouter;