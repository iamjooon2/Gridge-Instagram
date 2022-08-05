const { pool } = require('../assets/db');

const adminModel = require('../models/admin.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

// 사용자 목록 전체 조회
exports.retrieveUserList = async (id, name, signUpDate, status, page) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const offset = (page-1)*10;
        
        if (name === undefined) name = 'name';
        else name = `'${name}'`
        if (id === undefined) id = 'ID';
        else id = `'${id}'`;
        if (status === undefined) status = 'status';
        else status = `'${status}'`;
        let date;
        if (signUpDate !== undefined) date = signUpDate.replace(/(\d{4})(\d{2})(\d{2})/,`'$1-$2-$3'`);
        else date = "'createdAt'";

        const adminSelectResult = await adminModel.selectUserList(connection, id, name, date, status, offset);

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

// 관리자 권한으로 사용자 정지
exports.sudoBanUser = async (userIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const adminSelectResult = await adminModel.updateUserStatus(connection, userIdx);

        connection.release();
        
        return response(baseResponse.SUCCESS, adminSelectResult);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }

}

// 게시글 목록 조회
exports.retrievePostList = async (id, postDate, status, page) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const offset = (page-1)*10;
        
        if (id === undefined) id = 'ID';
        else id = `'${id}'`;
        if (status === undefined) status = 'status';
        else status = `'${status}'`;
        let date;
        if (postDate !== undefined) date = postDate.replace(/(\d{4})(\d{2})(\d{2})/,`'$1-$2-$3'`);
        else date = "'createdAt'";

        const adminSelectResult = await adminModel.selectPostList(connection, id, date, status, offset);

        connection.release();
        
        return response(baseResponse.SUCCESS, adminSelectResult);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글 세부 내용 조회
exports.retrievePostDetailList = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        
        const postResult = await adminModel.selectPostByPostIdx(connection, postIdx);
        const postImgResult = await adminModel.selectPostImgByPostIdx(connection, postIdx);
        const postLikeResult = await adminModel.selectPostLikeByPostIdx(connection, postIdx);
        const postReportResult = await adminModel.selectPostReportByPostIdx(connection, postIdx);
        const postCommentResult = await adminModel.selectPostCommentByPostIdx(connection, postIdx);

        connection.release();
        
        return response(baseResponse.SUCCESS, 
            [ {'게시글 정보': postResult } ,
            { '게시글 사진': postImgResult },
            { '게시글 좋아요 수': postLikeResult[0] },
            { '게시글 신고 목록': postReportResult },
            { '게시글 댓글 목록': postCommentResult }]);
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글, 댓글 강제 삭제
exports.sudoUpdatePostStatus = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);

        await adminModel.updatePostStatus(connection, postIdx);
        await adminModel.updateCommentStatus(connection, postIdx);

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}