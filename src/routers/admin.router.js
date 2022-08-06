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
    router.patch('/admin/post/:postIdx', adminController.patchPostStatus);

    // 신고 목록 보기
    router.get('/admin/report', adminController.getReportList);

    // 신고한 게시글 내용 보기
    router.get('/admin/report/post/:postIdx', adminController.getReportPost);

    // 신고한 댓글 내용 보기
    router.get('/admin/report/comment/:commentIdx', adminController.getReportComment);

    // 신고 사유 보기 
    // router.get('/admin/report', adminController);

    // 신고한 게시글 보기
    // router.patch('/admin/report/post/:postIdx', adminController.getReportPost);

    // 신고한 댓글 보기
    // router.patch('/admin/report/comment/:commentIdx', adminController.getReportComment);
};

module.exports = adminRouter;