const commentController = require('../controllers/comment.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');

const commentRouter = (router) =>{

    // 댓글 업로드 API
    router.post('/comment', jwtMiddleware, commentController.postComment);

    // 댓글 목록 조회 API
    router.get('/comment/:postIdx', commentController.getComments);

    // 댓글 수정 API
    router.patch('/comment/:commentIdx', jwtMiddleware, commentController.patchComment);
    
    // 댓글 삭제 API
    router.patch('/comment/:commentIdx/status', jwtMiddleware, commentController.patchCommentStatus);

    // 댓글 좋아요 API
    router.post('/comment/:commentIdx/like', jwtMiddleware, commentController.postCommentLike);

    // 댓글 좋아요 취소 API
    router.patch('/comment/:commentIdx/like', jwtMiddleware, commentController.postCommentDislike);

    // 댓글 신고 API
    router.post('/comment/:commentIdx/report', jwtMiddleware, commentController.postCommentReport);
}

module.exports = commentRouter;