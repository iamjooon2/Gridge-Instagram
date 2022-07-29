const { pool } = require('../assets/db');

const commentModel = require('../models/comment.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

// 댓글 생성
const createComment = async ( userIdx, postIdx, content) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const commentParmas = [userIdx, postIdx, content];
        const commentResult = await commentModel.insertComment(connection, commentParmas);

        connection.release();
        
        return
    } catch (e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    } 
}

// 댓글 수정
const updateComment = async (content, commentIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);

        const updateCommentParam = [content, commentIdx];

        const editCommentResult = await commentModel.updateComment(connection, updateCommentParam);

        if (!editCommentResult) {
            return errResponse(baseResponse.DB_ERROR);
        }

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (e){
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
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
const retrieveCommentLists = async (postIdx) => {
    const connection = await pool.getConnection(async (conn) => conn);

    const commentListResult = await commentModel.selectPostComments(connection, postIdx);

    connection.release();

    return commentListResult;
}

// 댓글 상태 비활성화로 변경(사용자입장 삭제)
const updateCommentStatus = async (commentIdx) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const commentStatusResult = await commentModel.selectCommentStatus(connection, commentIdx);

        if (commentStatusResult[0].status !== 0) {
            return errResponse(baseResponse.COMMENT_STATUS_INACTIVE);
        }

        const editCommentStatusResult = await commentModel.updateCommentStatusInactive(connection, commentIdx);

        return response(baseResponse.SUCCESS)
    } catch(e) {
        console.log(e);

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
    updateCommentStatus
}