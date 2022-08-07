const { pool } = require('../assets/db');

const commentModel = require('../models/comment.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

// 댓글 생성
const createComment = async ( userIdx, postIdx, content) => {
    const connection = await pool.getConnection(async (connection) => connection);
    try {
        await connection.beginTransaction();

        const commentParmas = [userIdx, postIdx, content];
        const commentResult = await commentModel.insertComment(connection, commentParmas);

        const commentIdx = commentResult.insertId;

        await commentModel.insertCommetLog(connection, commentIdx, 0);
        
        await connection.commit();
        return
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 댓글 수정
const updateComment = async (content, commentIdx) => {
    const connection = await pool.getConnection(async (connection) => connection);
    try {
        await connection.beginTransaction();
        const updateCommentParam = [content, commentIdx];

        const editCommentResult = await commentModel.updateComment(connection, updateCommentParam);

        if (!editCommentResult) {
            await connection.commit();

            return errResponse(baseResponse.DB_ERROR);
        }

        await commentModel.insertCommetLog(connection, commentIdx, 2);

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

// 댓글 작성자 확인
const retrieveUserIdx = async (commentIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const userIdx = await commentModel.selectUserIdxByCommentIdx(connection, commentIdx);
        
        connection.release();

        return userIdx;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 댓글 목록 조회
const retrieveCommentLists = async (postIdx, cursorTime) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const commentListResult = await commentModel.selectPostComments(connection, postIdx, cursorTime);

        if (commentListResult[0] == null) {
            await connection.commit();
            return 
        }
        console.log(commentListResult);

        await commentModel.insertCommetLog(connection, commentListResult[0].commentIdx, 1);

        await connection.commit();

        return commentListResult;
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return commentListResult;
    } finally {
        connection.release();
    }
}

// 댓글 상태 비활성화로 변경(사용자입장 삭제)
const updateCommentStatus = async (commentIdx) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const commentStatusResult = await commentModel.selectCommentStatus(connection, commentIdx);

        if (commentStatusResult[0].status !== 0) {
            await connection.commit();

            return errResponse(baseResponse.COMMENT_STATUS_INACTIVE);
        }
        const editCommentStatusResult = await commentModel.updateCommentStatusInactive(connection, commentIdx);
        
        await commentModel.insertCommetLog(connection, userIdx, 3);

        await connection.commit();
        return response(baseResponse.SUCCESS)
    } catch(e) {
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 댓글 좋아요 추가
const createCommentLike = async (userIdx, commentIdx) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const checkedCommentLikeResult = await commentModel.checkCommentLike(connection, userIdx, commentIdx);

        // 처음 좋아요 누르는 것이라면
        if (checkedCommentLikeResult[0].success == 0){
            // 칼럼 추가
            await commentModel.insertCommentLike(connection, userIdx, commentIdx);

            await connection.commit();
            return response(baseResponse.SUCCESS);
        }

        // 한 번 취소된 상태라면 이미 존재하는 status를 업데이트
        const commentLikeResult = await commentModel.updateCommentLike(connection, userIdx, commentIdx);

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

// 댓글 좋아요 취소
const createCommentDislike = async (userIdx, commentIdx) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const commentLikeResult = await commentModel.updateCommentDislike(connection, userIdx, commentIdx);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 댓글 신고
const createCommentReport = async (userIdx, commentIdx, reportCode) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const commentReportResult = await commentModel.checkCommentReport(connection, userIdx, commentIdx);

        // 이미 신고된 댓글이라면
        if (commentReportResult[0].success == 1){
            await connection.commit();
            
            // 이미 신고된 댓글임을 사용자에게 알리기
            return errResponse(baseResponse.REPORT_ENTERED);
        }
        const reportCommentResult = await commentModel.insertCommentReport(connection, userIdx, commentIdx, reportCode);
        const reportCommentIdx = reportCommentResult.insertId;
        await postModel.insertReportLog(connection, reportCommentIdx, 1, 0);

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

module.exports ={
    createComment,
    updateComment,
    retrieveUserIdx,
    retrieveCommentLists,
    updateCommentStatus,
    createCommentLike,
    createCommentDislike,
    createCommentReport
}