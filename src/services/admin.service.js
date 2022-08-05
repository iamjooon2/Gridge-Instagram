const { pool } = require('../assets/db');

const adminModel = require('../models/admin.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

// 사용자 목록 전체 조회
exports.retrieveUserList = async (id, name, signUpDate, status, page) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const offset = (page-1)*10;
        
        const adminSelectResult = await adminModel.selectUserList(connection, id, name, signUpDate, status, offset);

        connection.release();
        
        return response(baseResponse.SUCCESS, adminSelectResult);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 사용자 세부 내역 조회
exports.retrieveUserDetailList = async (userIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        
        const userLastLoginTime = await adminModel.selectUserLastLoginTime(connection, userIdx);
        const userPosts = await adminModel.selectUserPostByUserIdx(connection, userIdx);
        const userPostImg = await adminModel.selectUserProfileImgByUserIdx(connection, userIdx);
        const userPostLikes = await adminModel.selectUserPostLikeByUserIdx(connection, userIdx);
        const userPostReports = await adminModel.selectUserPostReportByUserIdx(connection, userIdx);
        const userComments = await adminModel.selectUserCommentByUserIdx(connection, userIdx);
        const userCommentLikes = await adminModel.selectUserCommentLikeByUserIdx(connection, userIdx);
        const userCommentRepoerts = await adminModel.selectUserCommentReportByUserIdx(connection, userIdx);
        const userFollowingMembers = await adminModel.selectUserFollowingByUserIdx(connection, userIdx);
        const userFollowerMembers = await adminModel.selectUserFollowerByUserIdx(connection, userIdx);
        const userMessages = await adminModel.selectUserMessageByUserIdx(connection, userIdx);

        connection.release();
        
        return response(baseResponse.SUCCESS, 
            [ {'마지막 로그인 시간': userLastLoginTime[0]} ,
            { '작성 게시글': userPosts },
            { '작성 게시글 사진': userPostImg },
            { '좋아요 누른 게시글': userPostLikes },
            { '신고한 게시글': userPostReports },
            { '작성 댓글': userComments },
            { '좋아요 누른 댓글': userCommentLikes },
            { '신고한 댓글': userCommentRepoerts },
            { '이 사용자가 팔로잉하는 사용자': userFollowingMembers },
            { '이 사용자를 팔로잉하는 사용자': userFollowerMembers },
            { '보낸 메시지': userMessages }]
        );
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}