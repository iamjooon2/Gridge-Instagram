const { pool } = require('../assets/db');

const adminModel = require('../models/admin.model');
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

// 사용자 목록 전체 조회
exports.retrieveUserList = async (id, name, signUpDate, status, page) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const offset = (page-1)*10;
        
        let whereQuery='';
        if (name !== undefined) {
            whereQuery += ` AND name = ${name}`
        }
        if (id !== undefined) {
            whereQuery += ` AND ID = ${id}`;
        }
        if (status !== undefined) {
            whereQuery = ` AND status = ${status}`
        }
        if (signUpDate !== undefined) {
            let date = signUpDate.replace(/(\d{4})(\d{2})(\d{2})/,`'$1-$2-$3'`)
            whereQuery += ` AND DATE(createdAt) = DATE(${date})`
        }

        const adminSelectResult = await adminModel.selectUserList(connection, whereQuery, offset);

        // 로그 디비 넣기
        for (i=0; i<adminSelectResult.length; i+=1){
            await userModel.insertUserLog(connection, adminSelectResult[i].userIdx, 6);
        }

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

        await userModel.insertUserLog(connection, userIdx, 6);

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

        await userModel.insertUserLog(connection, userIdx, 5);
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
        
        let whereQuery='';
        if (id !== undefined) {
            whereQuery += ` AND ID = ${id}`;
        }
        if (status !== undefined) {
            whereQuery = ` AND status = ${status}`
        }
        if (postDate !== undefined) {
            let date = postDate.replace(/(\d{4})(\d{2})(\d{2})/,`'$1-$2-$3'`)
            whereQuery += ` AND DATE(createdAt) = DATE(${date})`
        }

        const adminSelectResult = await adminModel.selectPostList(connection, whereQuery, offset);

        // 로그 집어넣기
        for (i =0; i<adminSelectResult.length; i+=1){
            await postModel.insertPostLog(connection, adminSelectResult[i].postIdx, 5);
        }

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

        console.log(postIdx);
        await postModel.insertPostLog(connection, postIdx, 5);

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
exports.sudoUpdatePostAndReleatedCommentStatus = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const postStatusResult = await adminModel.updatePostStatus(connection, postIdx);
        const commentsOfPostResult = await commentModel.selectCommentIdxByPostIdx(connection, postIdx);
        const commentStatusResult = await adminModel.updateCommentStatusByPostIdx(connection, postIdx);

        await postModel.insertPostLog(connection, postIdx, 4);
        for (i = 0; i<commentsOfPostResult.length; i+=1){
            await commentModel.insertCommetLog(connection, commentsOfPostResult[i].commentIdx, 4);
        }

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글 강제 삭제
exports.sudoUpdateCommentStatus = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        await adminModel.updatePostStatus(connection, postIdx);

        await postModel.insertPostLog(connection, postIdx, 4);

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 댓글 강제 삭제
exports.sudoUpdateCommentStatus = async (commentIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        await adminModel.updateCommentStatusByCommentIdx(connection, commentIdx);
        await commentModel.insertCommetLog(connection, commentIdx, 4);

        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 모든 신고 내역 조회
exports.retrieveReportList = async () => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const postReportResult = await adminModel.selectPostReports(connection);
        const commentReportResult = await adminModel.selectCommentReports(connection);

        console.log(postReportResult);
        for (i = 0; i<postReportResult.length; i+=1){
            await postModel.insertReportLog(connection, postReportResult[i].postReportIdx,1, 5);
        }
    
        for (i = 0; i<commentReportResult.length; i+=1){
            await commentModel.insertReportLog(connection, commentReportResult[i].connectionReportIdx, 0, 5);  
        }

        return response(baseResponse.SUCCESS,
           {"댓글 신고 목록" : postReportResult, "게시글 신고 목록" : commentReportResult},
        );
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 신고 게시글 내용 조회
exports.retrieveReportPostContent = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const postReportResult = await adminModel.selectReportPostContent(connection, postIdx);

        await postModel.insertPostLog(connection, postIdx, 4);

        return response(baseResponse.SUCCESS, postReportResult);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 신고 댓글 내용 조회
exports.retrieveReportCommentContent = async (commentIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const commentReportResult = await adminModel.selectReportCommentContent(connection, commentIdx);

        await commentModel.insertCommetLog(connection, commentIdx, 4);

        return response(baseResponse.SUCCESS, commentReportResult);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글 신고 사유 조회
exports.retrieveReportPostReportCode = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const postReportResult = await adminModel.selectReportPostReportCode(connection, postIdx);

        await postModel.insertReportLog(connection, postReportResult[0].postReportResult, 1, 5);

        return response(baseResponse.SUCCESS, postReportResult);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 댓글 신고 사유 조회
exports.retrieveReportCommentReportCode = async (commentIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const commentReportResult = await adminModel.selectReportCommentReportCode(connection, commentIdx);

        await commentModel.insertReportLog(connection, commentReportResult[0].commentReportIdx, 0, 5);

        return response(baseResponse.SUCCESS, commentReportResult);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }   
}

// 게시글 신고 강제 삭제
exports.sudoUpdatePostReportStatus = async (postReportIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const postReportResult = await adminModel.updatePostReportStatus(connection, postReportIdx);

        await postModel.insertReportLog(connection, postReportIdx, 0, 4);
        return response(baseResponse.SUCCESS, postReportResult);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }   
}

// 댓글 신고 강제 삭제
exports.sudoUpdateCommentReportStatus = async (commentReportIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const commentReportResult = await adminModel.updateCommentReportStatus(connection, commentReportIdx);

        await commentModel.insertReportLog(connection, commentReportIdx, 1, 4);
        return response(baseResponse.SUCCESS, commentReportResult);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }   
}

// 사용자 관련 로그 조회
exports.retrieveUserLogs = async (page) => {
    try {
        const connection = await pool.getConnection(async(connection)=> connection);
        const offset = (page-1)*10;
        const LogResults = await adminModel.selectUserLogs(connection, offset);

        connection.release();

        return response(baseResponse.SUCCESS, [LogResults]);
    } catch (e){
        console.log(e)

        return errResponse(baseResponse.DB_ERROR)
    }
}

// 게시글 관련 로그 조회
exports.retrievePostLogs = async (page) => {
    try {
        const connection = await pool.getConnection(async(connection)=> connection);
        const offset = (page-1)*10;
        const LogResults = await adminModel.selectPostLogs(connection, offset);

        connection.release();

        return response(baseResponse.SUCCESS, [LogResults]);
    } catch (e){
        console.log(e)

        return errResponse(baseResponse.DB_ERROR)
    }
}

// 댓글 관련 로그 조회
exports.retrieveCommentLogs = async (page) => {
    try {
        const connection = await pool.getConnection(async(connection)=> connection);
        const offset = (page-1)*10;
        const LogResults = await adminModel.selectCommentLogs(connection, offset);

        connection.release();

        return response(baseResponse.SUCCESS, [LogResults]);
    } catch (e){
        console.log(e)

        return errResponse(baseResponse.DB_ERROR)
    }
}

// 신고 관련 로그 조회
exports.retrieveReportLogs = async (page) => {
    try {
        const connection = await pool.getConnection(async(connection)=> connection);
        const offset = (page-1)*10;
        const LogResults = await adminModel.selectReportLogs(connection, offset);

        connection.release();

        return response(baseResponse.SUCCESS, [LogResults]);
    } catch (e){
        console.log(e)

        return errResponse(baseResponse.DB_ERROR)
    }
}