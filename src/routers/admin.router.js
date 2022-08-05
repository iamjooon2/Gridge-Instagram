const adminController = require('../controllers/admin.controller');

const adminRouter = (router) =>{

    // 회원 전체 정보 보기
    router.get('/admin/user', adminController.getUserList);
    
    // 회원 상세 정보 보기
    router.get('/admin/user/:userIdx', adminController.getUserDetailList);

    // // 포스트 전체 정보 보기
    // router.get('/admin/post', adminController.getPostList);
    
    // // 포스트 상세 정보 보기
    // router.get('/admin/post/:postIdx', adminController.getPostDetail);

    // // 회원 전체 정보 보기
    // router.get('/admin/report', adminController.getUserList);
    

};

module.exports = adminRouter;