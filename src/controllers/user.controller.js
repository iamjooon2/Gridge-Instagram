const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const userService = require('../services/user.service');
const { response, errResponse }= require("../utilities/response");
const baseResponse = require("../utilities/baseResponseStatus");

const regexPassword = new RegExp(/^[a-zA-Z\\d`~!@#$%^&*()-_=+]{6,20}$/); // 특수문자 포함한 6~20자 허용하는 정규표현식
const regexPhone = new RegExp(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/); //전화번호 형식 확인 정규표현식
const regexDate = new RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/); // 날짜 정규표현식

// 로그인
const logIn = async (req, res) => {

    const {id, password} = req.body;
    
    // id Validation
    if (!id){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else if (id.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (id.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // password Validation
    if (!password){
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
    } else if (password.length > 20) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
    } else if (password.length < 6) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
    } else if (!regexPassword.test(password)) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_REGEX));
    }

    // 사용자 아이디 존재 여부 확인
    const userIdExistsResult = await userService.checkUserIdExists(id);

    if (!userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }

    // 사용자가 입력한 비밀번호와 DB 비밀번호 일치 여부 확인
    const passwordCheckResult = await userService.checkUserPassword(id, password);

    if (!passwordCheckResult){
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

    const userIdx = await userService.retrieveUserIdxById(id);

    // 토큰 발행
    let token = await jwt.sign({  
        idx: userIdx
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

// 카카오 로그인
const kakaoLogin = async (req, res) => {

    let user_kakao_profile;
    let accessToken = req.headers['x-access-token'] || req.headers['authorization'];
    accessToken = accessToken.replace(/^Bearer\s+/, "");
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
        return res.send(errResponse(baseResponse.ACCESS_TOKEN_EMPTY));
    }

    // 카카오 서버에서 받아온 kakaoId
    const kakaoId = String(user_kakao_profile.data.id);   // 카카오 고유ID

    /**
     * 사용자의 socialId 고유번호가 DB에 존재하는지 체크
     * 존재하면? -> 기존에 있던 유저 -> 바로 JWT 발급 및 로그인 처리
     * 존재하지 않는다면? -> 회원가입 API 진행
     */
    const isKakaoExist = await userService.checkSocialId(kakaoId);

    if (!isKakaoExist) {
        return res.send(response(baseResponse.SIGNIN_ERROR));
    }
    
    // 유저 식별자 가져오기
    const userIdx = await userService.retrieveUserIdxByKakaoId(kakaoId)[0].userIdx;

    // jwt 토큰 생성
    let token = await jwt.sign(
    {  // 토큰의 내용 (payload)
        userIdx: userIdx
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "30d",
        subject: "userInfo",
    });

    // 토큰을 보내며 로그인처리 완료
    return res.header({'Authorization' : `Bearer ${token}`})
                .send(response(baseResponse.SUCCESS));
};

// 자동로그인
const autoLogin = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userIdx;
    console.log(`[Auto-Login API] userIdx: ${userIdFromJWT}`);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

// 회원가입
const signUp = async (req, res) => {

    const { phone, authNumber, name, password, birth, id } = req.body;

    // phone validation
    if (!phone){
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
    } else if (phone.length !== 11) {
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_LENGTH));
    } else if (!regexPhone.test(phone)) {
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH));
    }

    // phone authentication 
    if (authNumber!==123456){
        return res.send(errResponse(baseResponse.AUTH_NUMBER_WRONG))
    } 

    // name validation
    if (!name){
        return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
    } else if (name.length > 20) {
        return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
    } 

    // password validation
    if (!password){
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    } else if (password.length > 20) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
    } else if (password.length < 6) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
    } else if (!regexPassword.test(password)) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_REGEX));
    }

    // birth validation
    if (!birth){
        return res.send(errResponse(baseResponse.SIGNUP_BIRTH_EMPTY));
    } else if (!regexDate.test(birth)) {
        return res.send(errResponse(baseResponse.SIGNUP_BIRTH_REGEX));
    }

    // id Validation
    if (!id){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else if (id.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (id.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // 사용자 아이디 존재 여부 확인
    const userIdExistsResult = await userService.checkUserIdExists(id);
    if (userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_EXIST));
    }
    
    const userSignUpResult = await userService.postSignUp(phone, name, password, birth, id);

    return res.send(response(baseResponse.SUCCESS));
}

// 소셜 로그인 유저 회원가입
const socialSignUp = async (req, res) => {

    const { phone, authNumber, name, birth, id } = req.body;

    // phone validation
    if (!phone){
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
    } else if (phone.length !== 11) {
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_LENGTH));
    } else if (!regexPhone.test(phone)) {
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH));
    }

    // phone authentication 
    if (authNumber!==123456){
        return res.send(errResponse(baseResponse.AUTH_NUMBER_WRONG))
    } 

    // name validation
    if (!name){
        return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
    } else if (name.length > 20) {
        return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
    }
    // birth validation
    if (!birth){
        return res.send(errResponse(baseResponse.SIGNUP_BIRTH_EMPTY));
    } else if (!regexDate.test(birth)) {
        return res.send(errResponse(baseResponse.SIGNUP_BIRTH_REGEX));
    }

    // id Validation
    if (!id){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else if (id.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (id.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // 사용자 아이디 존재 여부 확인
    const userIdExistsResult = await userService.checkUserIdExists(id);

    if (userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_EXIST));
    }
    
    const userSignUpResult = await userService.postSignUp(phone, name, 'socailUser', birth, id);

    return res.send(response(baseResponse.SUCCESS));
}

// 사용자 계정 사용 가능 확인
const checkIdAvailable = async (req, res) => {

    const id = req.body.id;
    // id Validation
    if (!id){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else if (id.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (id.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // 사용자 아이디 존재 여부 확인
    const userIdExistsResult = await userService.checkUserIdExists(id);

    if (userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_EXIST));
    }

    return res.send(response(baseResponse.SUCCESS));
}

// 본인 정보 보기
const getUserInfo = async (req, res) => {
    
    const userIdxInfoFromToken = req.verifiedToken.idx;
    const userIdx = userIdxInfoFromToken[0].userIdx;
    const page = req.query.page;

    // validation
    if (!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else  if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }

    // 
    if (!page) {
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    } else if (page <= 0) {
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    }

    const userInfoResult = await userService.getUserInfo(userIdx, page);

    return res.send(response(baseResponse.SUCCESS, userInfoResult));
}

// 전화번호로 비밀번호 변경하기
const patchPassword = async (req, res) => {
    
    const { phone, password } = req.body;

    // phone validation
    if (!phone){
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
    } else if (phone.length !== 11) {
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_LENGTH));
    } else if (!regexPhone.test(phone)) {
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH));
    }

    // password Validation
    if (!password){
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
    } else if (password.length > 20) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
    } else if (password.length < 6) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
    } else if (!regexPassword.test(password)) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_REGEX));
    }

    const changedPasswordResult = await userService.patchPassword(phone, password);

    return res.send(changedPasswordResult)
}

// 내 프로필 정보 변경
const patchProfile = async (req, res) => {

    const userIdxInfoFromToken = req.verifiedToken.idx;
    const userIdx = userIdxInfoFromToken[0].userIdx;
    const { profileImgUrl, name, id, website, introduce } = req.body;

    // website, introduce는 nullable하기때문에 validation 하지 않음
    // 사용자 이름 validation
    if (!name){
        return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
    } else if (name.length > 20) {
        return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
    }

    // id validation
    if (!id){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else if (id.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (id.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // 변경하려는 아이디 존재 여부 확인
    const userIdExistsResult = await userService.checkUserIdExists(id);

    if (userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_EXIST));
    }

    const changeProfileResult = await userService.changeUserProfile(profileImgUrl, name, id, website, introduce, userIdx);

    return res.send(changeProfileResult);
}

// 이름, 아이디만 변경
const patchNameAndId = async (req, res) => {

    const userIdxInfoFromToken = req.verifiedToken.idx;
    const userIdx = userIdxInfoFromToken[0].userIdx;
    const { name, id } = req.body;

    // name validation
    if (!name){
        return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
    } else if (name.length > 20) {
        return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
    }

    // id validation
    if (!id){
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    } else if (id.length > 20) {
        return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
    } else if (id.length < 3) {
        return res.send(errResponse(baseResponse.USER_USERID_SHORT));
    }

    // 아이디 중복 확인
    const userIdExistsResult = await userService.checkUserIdExists(id);
    if (userIdExistsResult){
        return res.send(errResponse(baseResponse.USER_USERID_EXIST));
    }

    const nameAndIdChangeResult = await userService.changeNameAndId(name, id, userIdx);

    return res.send(nameAndIdChangeResult);
}

// 계정 공개여부 설정
const patchPrivate = async (req, res) => {
    
    const userIdxInfoFromToken = req.verifiedToken.idx;
    const userIdx = userIdxInfoFromToken[0].userIdx;
    // 비공개/공개 여부를 설정한 코드 1-비공개 / 0-공개
    const privateCode = req.query.privateCode;

    // validation
    if (!privateCode) {
        return res.send(errResponse(baseResponse.PRIVATE_CODE_EMPTY))
    } else if ( privateCode > 1 || privateCode < 0) {
        return res.send(errResponse(baseResponse.PRIVATE_CODE_ERROR))
    }
    
    const checkPrivate = await userService.changePrivate(userIdx, privateCode);

    return res.send(checkPrivate);
}


module.exports = {
    logIn,
    kakaoLogin,
    autoLogin,
    signUp,
    socialSignUp,
    checkIdAvailable,
    getUserInfo,
    patchPassword,
    patchProfile,
    patchNameAndId,
    patchPrivate
};