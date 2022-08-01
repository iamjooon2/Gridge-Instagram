const userController = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');

const userRouter = (router) =>{

    // 로그인 API
    router.post('/login', userController.logIn);

    // 자동 로그인 API
    router.get('/auto-login', jwtMiddleware, userController.autoLogin);

    // 카카오 로그인 API
    router.get('/kakao-login', userController.kakaoLogin);

    // 회원가입 API
    router.post('/signUp', userController.signUp);

    // 소셜 회원가입 API
    router.post('/social-signUp', userController.socialSignUp);

    // 사용자 아이디 사용 확인 API
    router.get('/checkId', userController.checkIdAvailable);

    // 내 정보 불러오는 API
    router.get('/profile', jwtMiddleware, userController.getUserInfo);

    // 비밀번호 변경 API
    router.patch('/password', userController.patchPassword);

    // 프로필 변경 API
    router.patch('/profile', jwtMiddleware, userController.patchProfile);

    // 이름, 아이디 변경 API
    router.patch('/nameAndId', jwtMiddleware, userController.patchNameAndId);

    // 계정 공개 여부 설정 API
    router.patch('/profile/private', jwtMiddleware, userController.patchPrivate);

    // 사용자 팔로우 or 팔로우 요청 
    router.post('/user/follow', jwtMiddleware, userController.followUser);

    // 사용자 팔로우 취소 or 팔로우 요청 취소
    router.patch('/user/follow', jwtMiddleware, userController.unfollowUser);

    // 팔로우 요청 확인
    router.get('/user/follow/request', jwtMiddleware, userController.getFolowRequests);

    // 팔로우 요청 수락/거절
    router.patch('/user/follow/request', jwtMiddleware, userController.patchFollowRequests);

    // 회원 탈퇴
    // router.patch('/user', jwtMiddleware, userController);
}

module.exports = userRouter;