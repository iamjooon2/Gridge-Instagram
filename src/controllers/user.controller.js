const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const userService = require('../services/user.service');
const { response, errResponse }= require("../utilities/response");
const baseResponse = require("../utilities/baseResponseStatus");

const regexPassword = new RegExp('^[a-zA-Z\\d`~!@#$%^&*()-_=+]{6,20}$'); // 특수문자 포함한 6~20자 허용하는 정규표현식

const signIn = async (req, res) => {

    const {userId, userPassword} = req.body;
    
    // userId Validation
    if (!userId){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else 
    if (userId.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (userId.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // userPassword Validation
    if (!userPassword){
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    } else if (userPassword.length > 20) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
    } else if (userPassword.length < 6) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
    } else if (!regexPassword.test(userPassword)) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_REGEX));
    }

    // 사용자 아이디 존재 여부 확인
    const userIdExistsResult = await userService.checkUserExists(userId);

    if (!userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    // 사용자가 입력한 비밀번호와 DB 비밀번호 일치 여부 확인
    const passwordCheckResult = await userService.checkUserPassWord(userId, userPassword);

    if (!passwordCheckResult){
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

    // 토큰 발행
    let token = await jwt.sign({  
        userId: userId
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "30d",
        subject: "userInfo",
    });

    // header에는 token, body에는 json을 담아 response
    return res.header({'Authorization' : `Bearer ${token}`})
                .send(response(baseResponse.SUCCESS));
}


const kakaoLogin = async (req, res) => {
    let user_kakao_profile;
    const accessToken = req.headers.Authorization;

    /* Validation */
    if (!accessToken) {
        return res.send(errResponse(baseResponse.ACCESS_TOKEN_EMPTY));
    }
    // 프론트에서 받은 access token을 카카오 서버로 보내서 사용자 정보 가져옴
    try {
        user_kakao_profile = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    } catch(err) {   // 카카오 access token 만료 등?
        return res.send(errResponse(baseResponse.ACCESS_TOKEN_INVALID));
    }

    // 카카오 서버에서 받아온 사용자 정보들
    const email = user_kakao_profile.data.kakao_account.email;   // 사용자 이메일 (카카오)
    const kakaoId = String(user_kakao_profile.data.id);   // 카카오 고유ID

    /**
     * 사용자의 카카오 고유번호가 DB에 존재하는지 체크할 것
     * 존재하면? -> 기존에 있던 유저 -> 바로 JWT 발급 및 로그인 처리 + 사용자 status 수정
     * 존재하지 않는다면? -> 회원가입 API 진행 (닉네임 입력 페이지)
     */
    const isKakaoExist = await userProvider.retrieveKakaoIdCheck(kakaoId);

    if (isKakaoExist) {   // 원래 있던 유저라면
        // 유저 인덱스 가져오기
        const userIdx = (await userProvider.retrieveUserIdByKakaoId(kakaoId))[0].userIdx;

        // jwt 토큰 생성
        let token = await jwt.sign({  // 토큰의 내용 (payload)
                userIdx: userIdx
            },
            secret_key.jwtsecret,   // 비밀키
            {
                expiresIn: "30d",
                subject: "userInfo",
            }
        );

        // 로그인한 User 정보 출력
        const loginUserResult = await userService.getUserInfoByUserIdx(kakaoId);

        console.log(`[Kakao Login API] login-userIdx: ${userIdx}, nickName: ${loginUserResult[0].nickName}`);

        return res.send(response(baseResponse.KAKAO_LOGIN_SUCCESS, {
                'userIdx': userIdx,
                'jwt': token,
                'email': loginUserResult[0].email,
                'nickName': loginUserResult[0].nickName,
                'profileImgUrl': loginUserResult[0].profileImgUrl,
                'kakaoId': loginUserResult[0].kakaoId,
            }));
    }
    else   // 신규 유저라면
        return res.send(response(baseResponse.KAKAO_SIGN_UP, {
            'email': email,
            'profileImgUrl': s3_profileUrl.Location,
            'kakaoId': kakaoId,
        }));
};


module.exports = {
    signIn,
    kakaoLogin,
};