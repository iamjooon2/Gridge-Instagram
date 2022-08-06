const adminController = require('../controllers/admin.controller');

const adminRouter = (router) =>{

    // 회원 전체 정보 보기
    router.get('/admin/user', adminController.getUserList);
    
    // 회원 상세 정보 보기
    router.get('/admin/user/:userIdx', adminController.getUserDetailList);

    // 회원 관리자 정지
    router.patch('/admin/user/:userIdx', adminController.patchUserStatus);
    
    // 포스트 전체 정보 보기
    router.get('/admin/post', adminController.getPostList);
    
    // 포스트 상세 정보 보기
    router.get('/admin/post/:postIdx', adminController.getPostDetailList);

    // 포스트 관리자 삭제
    router.patch('/admin/post/:postIdx', adminController.patchPostAndCommentStatus);

    // 신고 목록 보기
    router.get('/admin/report', adminController.getReportList);

    // 신고한 게시글 내용 보기
    router.get('/admin/report/post/content/:postIdx', adminController.getReportPost);

    // 신고한 댓글 내용 보기
    router.get('/admin/report/comment/content/:commentIdx', adminController.getReportComment);

    // 댓글 신고 사유 보기 
    router.get('/admin/report/post/reportCode/:postIdx', adminController.getReportPostContent);

    // 게시글 신고 사유 보기 
    router.get('/admin/report/comment/reportCode/:commentIdx', adminController.getReportCommentContent);

    // 신고당한 게시글 삭제
    router.patch('/admin/report/post/:postIdx', adminController.patchPostStatus);

    // 신고당한 댓글 삭제
    router.patch('/admin/report/comment/:commentIdx', adminController.patchCommentStatus);

    // 게시글 신고 삭제
    router.patch('/admin/report/post/reportCode/:postReportIdx', adminController.patchPostReportStatus);

    // 댓글 신고 삭제
    router.patch('/admin/report/comment/reportCode/:commentReportIdx', adminController.patchCommentReportStatus);

    // 사용자 CRUD 로그 사유 보기 
    router.get('/admin/user/log', adminController.getUserLogs);

    // 게시글 CRUD 로그 사유 보기 
    router.get('/admin/post/log', adminController.getPostLogs);

    // 댓글 CRUD 로그 사유 보기 
    router.get('/admin/comment/log', adminController.getCommentLogs);

    // 신고 CRUD 로그 사유 보기 
    router.get('/admin/report/log', adminController.getReportLogs);
};

module.exports = adminRouter;