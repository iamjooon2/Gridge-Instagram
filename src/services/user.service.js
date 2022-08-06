const bcrypt = require('bcrypt');
const { pool } = require('../assets/db');
const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const { response, errResponse } = require('../utilities/response');
const baseResponse = require('../utilities/baseResponseStatus');

// 사용자의 ID가 존재하는지 확인
const checkUserIdExists = async (userId) => {
    try {
        const connection = await pool.getConnection((connection) => connection);
        const checkedUser = await userModel.checkUserExistsByUserId(connection, userId);

        connection.release();
        
        // 사용자가 존재하지 않을 때
        if (checkedUser == 0){
            return false;
        }

        return true;
    } catch (e) {
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 사용자의 비밀번호가 일치하는지 확인
const checkUserPassword = async (userId, userPassword) => {
    try {
        const connection = await pool.getConnection((connection) => connection);
        const checkedUserPassword = await userModel.checkUserPassword(connection, userId);

        connection.release();

        // DB 저장된 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 확인
        const match = bcrypt.compareSync(userPassword, checkedUserPassword[0]["password"]);
        
        if (!match){
            return false;
        }
        return true;
    } catch (e) {
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }

}

// 회원정보 데이터베이스에 넣기
const postSignUp = async (phone, name, password, birth, id, userType, socialId) => {
    const connection = await pool.getConnection(async (connection) => connection);
    try {
        await connection.beginTransaction();
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const signUpResult = await userModel.insertUser(connection, phone, name, hashedPassword, birth, id, userType, socialId);
        const userIdx = signUpResult.userId;

        await userModel.insertUserLog(connection, userIdx, 0);

        await connection.commit();

        return response(signUpResult);
    } catch (e){
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 소셜 회원 검증
const checkSocialId = async (socialId) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const checkedResult = await userModel.getSocialId(conn, socialId);

        connection.release();
        
        // 사용자가 존재하지 않을 때
        if (checkedResult == 0){
            return false;
        }
        return true;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 카카오ID로 유저 식별자 가지고 오기
const retrieveUserIdxByKakaoId = async (socialId) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const userIdxResult = await userModel.getUserIdxBySocialId(connection, socialId);

        connection.release();

        return userIdxResult[0].userIdx;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// ID로 유저 식별자 가지고 오기
const retrieveUserIdxById  = async (userId) =>{
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const userIdxResult = await userModel.getUserIdxByUserId(connection, userId);
        
        connection.release();

        // 없는 경우 false 반환
        if (userIdxResult[0] == null){
            return false;
        }

        // userIdx 뽑아서 리턴
        return userIdxResult[0].userIdx;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 사용자 본인 프로필 정보 가지고 오기
const getUserInfo = async (userIdx, page) => {
    const connection = await pool.getConnection(async (connection) => connection);
    try {
        await connection.beginTransaction();

        const userProfileResult = await userModel.getUserProfile(connection, userIdx);
        const offset = (page-1)*9;
        
        const userPostResult = await postModel.selectUserPhotos(connection, userIdx, offset);
        await userModel.insertUserLog(connection, userIdx, 1);

        await connection.commit();
        const userResult = { userProfileResult, userPostResult };

        return userResult;
    } catch (e){
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 사용자 핸드폰번호로 비밀번호 업데이트하기
const patchPassword = async (phone, password) => {
    const connection = await pool.getConnection(async(connection) => connection);
    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);
        const userPhoneCheckResult = await userModel.getUserIdxByPhone(connection, phone);

        // 전화번호에 해당하는 userIdx 확인
        if (!userPhoneCheckResult){
            await connection.commit();

            return errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH);
        }
        const userIdx = userPhoneCheckResult[0].userIdx;

        const passwordParams = [ hashedPassword, userIdx ];
        await userModel.updatePassword(connection, passwordParams);

        await connection.commit();

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 사용자 프로필 업데이트하기
const changeUserProfile = async (profileImgUrl, name, id, website, introduce, userIdx) => {
    const connection = await pool.getConnection(async(connection) => connection);
    try {
        await connection.beginTransaction();
        const updatedProfileResult = await userModel.updateUserProfile(connection, profileImgUrl, name, id, website, introduce, userIdx);
        
        await userModel.insertUserLog(connection, userIdx, 2);

        await connection.commit();

        return response(baseResponse.SUCCESS);
    } catch (e){
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 계정 공개여부 변경하기
const changePrivate = async (userIdx, privateCode) => {
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const updatedPrivateResult = await userModel.updatePrivate(connection, userIdx, privateCode);
        
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (e){
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 팔로우 정보 확인(boolean return)
const checkfollowStatus = async (userIdx, followUserId, status) =>{
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const checkFollowingResult = await userModel.checkFollowByTargetId(connection, userIdx, followUserId, status);

        connection.release();

        // 해당 정보 없을시 false 반환
        if (checkFollowingResult[0].success == 0) {
            return false;
        }

        return true;
    } catch (e){
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 팔로우 요청 정보 확인
const getFolowRequestExists = async (userIdx, followeeId) => {
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const checkFollowingResult = await userModel.checkFollowByRequesterId(connection, userIdx, followeeId, 2);

        connection.release();

        // 해당 정보 없을시 false 반환
        if (checkFollowingResult[0].success == 0) {
            return false;
        }

        return true;
    } catch (e){
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 팔로우하기
const followUser = async (userIdx, followUserId) => {
    const connection = await pool.getConnection(async(connection) => connection);
    try {
        await connection.beginTransaction();
        
        const userPrivateInfo = await userModel.checkUserPrivateById(connection, followUserId);
        const followHistoryInfo = await userModel.checkFollow(connection, userIdx, followUserId, 1); // 이전 팔로우 기록 확인

        // 상대방이 비공개 계정인 경우
        if (userPrivateInfo[0].success == 1){


            // 이전에 팔로우 했다가 지운 상태인지 확인
            followHistoryInfo[0].success == 1 ?
                //  있다면 status를 요청 대기중으로 업데이트
                ( await userModel.updateFollowStatusByTargetId(connection, userIdx, followUserId, 2)) :
                 // 없다면 새로운 칼럼으로 요청 대기중을 집어넣는다
                ( await userModel.insertFollow(connection, userIdx, followUserId, 2));

            await connection.commit();

            return response(baseResponse.FOLLOW_REQUEST_SUCCESS);
        }
        
        // 상대방이 공개 계정인 경우
        // 이전에 팔로우 했다가 지운 상태인지 확인
        followHistoryInfo[0].success == 1 ?
            // 있다면 기존 칼럼 status를 업데이트
            ( await userModel.updateFollowStatusByTargetId(connection, userIdx, followUserId, 0)) :
            // 없다면 새로운 칼럼을 삽입
            ( await userModel.insertFollow(connection, userIdx, followUserId, 0));

        await connection.commit();
        
        return response(baseResponse.FOLLOW_SUCCESS);
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 팔로우 취소하기
const unfollowUser = async (userIdx, unfollowUserId) => {
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const unfollowResult = await userModel.updateFollowStatusByTargetId(connection, userIdx, unfollowUserId, 1);

        connection.release();
        return response(baseResponse.UNFOLLOW_SUCCESS);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 비공개 계정 여부 확인
const isUserPrivateTrue = async (userIdx) => {
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const userPrivateInfo = await userModel.checkUserPrivateByUserIdx(connection, userIdx);
        
        connection.release();

        if (userPrivateInfo[0].success == 0) {
            return false;
        }

        return true;
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 내 팔로우 요청 확인
const checkMyFollowRequest = async (userIdx) => {
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const userFollowRequestList = await userModel.checkUserFollowRequests(connection, userIdx);
        
        connection.release();

        return response(baseResponse.SUCCESS, userFollowRequestList);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 사용자 팔로우 요청 상태 업데이트
const changeFollowStatus = async (userIdx, followeeId, responseCode) => {
    try {
        const connection = await pool.getConnection(async(connection) => connection);
        const updateFollowStatusResult = await userModel.updateFollowStatusByRequesterId(connection, userIdx, followeeId, responseCode);

        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 사용자 탈퇴
const changeUserStatus = async (userIdx) => {
    const connection = await pool.getConnection(async(connection) => connection);
    try {
        await connection.beginTransaction();

        // 사용자 삭제상태로 바꾸고 id, token, 프로필 사진 없애기
        await userModel.updateUserStatus(connection, userIdx);
        await userModel.updateUserIdNull(connection, userIdx);
        await userModel.updateUserTokenNull(connection, userIdx);
        await userModel.updateUserProfileImgUrlStatus(connection, userIdx);

        // 게시물 없애기
        await userModel.updatePostStatusInactive(connection, userIdx);
        await userModel.updatePostImgStatusInactive(connection, userIdx);

        // 댓글 없애기
        await userModel.updateCommentStatusInactive(connection, userIdx);

        // 좋아요 없애기
        await userModel.updateCommentLikeStatusInactive(connection, userIdx);
        await userModel.updatePostLikeStatusInactive(connection, userIdx);

        // 팔로우 없애기
        await userModel.updateFollowStatusInactive(connection, userIdx);

        // 로그 기록하기
        await userModel.insertUserLog(connection, userIdx, 3);

        await connection.commit(); 

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 토큰 넣기 + 로그인 시간 업데이트 - 로그인때 사용
const postUserToken = async (userIdx, token) => {
    const connection = await pool.getConnection(async(conn)=> conn);
    try {
        await connection.beginTransaction();

        const checkValidAccessResult = await userModel.updateUserToken(connection, userIdx, token);
        await userModel.updateLoginTime(connection, userIdx);

        await connection.commit();

        return checkValidAccessResult;
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return response(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 유효된 토큰인지 확인
const checkValidAccess = async (userIdx) => {
    try {
        const connection = await pool.getConnection(async(conn)=> conn);
        const checkValidAccessResult = await userModel.selectUserTokenByIdx(connection, userIdx);

        connection.release();

        return checkValidAccessResult;
    } catch (e) {
        console.log(e);

        return response(baseResponse.DB_ERROR);
    }
}

// 사용자 타입 확인 - 자체로그인, 소셜로그인
const checkUserType = async (userIdx) => {
    try {
        const connection = await pool.getConnection(async(conn)=> conn);
        const userTypeResult = await userModel.getUserType(connection, userIdx);

        connection.release();

        return userTypeResult;
    } catch (e) {
        console.log(e);

        return response(baseResponse.DB_ERROR);
    }
}

module.exports = {
    checkUserIdExists,
    checkUserPassword,
    postSignUp,
    checkSocialId,
    retrieveUserIdxByKakaoId,
    retrieveUserIdxById,
    getUserInfo,
    patchPassword,
    changeUserProfile,
    changePrivate,
    checkfollowStatus,
    getFolowRequestExists,
    followUser,
    unfollowUser,
    isUserPrivateTrue,
    checkMyFollowRequest,
    changeFollowStatus,
    changeUserStatus,
    checkValidAccess,
    postUserToken,
    checkUserType
};