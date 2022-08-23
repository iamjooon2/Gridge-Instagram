const CommentModel = require('../models/comment.model');

const { pool } = require('../assets/db');

const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

class CommentService {

    constructor() {
        this.CommentModel = CommentModel;
    }

    // 댓글 생성
    createComment = async ( userIdx, postIdx, content) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const commentParmas = [userIdx, postIdx, content];
            const commentResult = await this.CommentModel.insertComment(connection, commentParmas);

            const commentIdx = commentResult.insertId;

            await this.CommentModel.insertCommetLog(connection, commentIdx, 0);
            
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
    updateComment = async (content, commentIdx) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const updateCommentParam = [content, commentIdx];
            const editCommentResult = await this.CommentModel.updateComment(connection, updateCommentParam);
        
            if (editCommentResult[0]==null) {
                await connection.commit();

                return errResponse(baseResponse.DB_ERROR);
            }

            await this.CommentModel.insertCommetLog(connection, commentIdx, 2);

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
    retrieveUserIdx = async (commentIdx) => {
        try {
            const connection = await pool.getConnection(async (connection) => connection);
            const userIdx = await this.CommentModel.selectUserIdxByCommentIdx(connection, commentIdx);
            
            connection.release();

            return userIdx;
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 댓글 목록 조회
    retrieveCommentLists = async (postIdx, cursorTime) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const commentListResult = await this.CommentModel.selectPostComments(connection, postIdx, cursorTime);

            console.log(commentListResult)

            if (commentListResult[0] == null) {
                await connection.commit();
                return 
            }

            await this.CommentModel.insertCommetLog(connection, commentListResult[0].commentIdx, 1);

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
    updateCommentStatus = async (commentIdx) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const commentStatusResult = await this.CommentModel.selectCommentStatus(connection, commentIdx);

            if (commentStatusResult[0].status !== 0) {
                await connection.commit();

                return errResponse(baseResponse.COMMENT_STATUS_INACTIVE);
            }
            const editCommentStatusResult = await this.CommentModel.updateCommentStatusInactive(connection, commentIdx);
            
            await this.CommentModel.insertCommetLog(connection, commentIdx, 3);

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
    createCommentLike = async (userIdx, commentIdx) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const checkedCommentLikeResult = await this.CommentModel.checkCommentLike(connection, userIdx, commentIdx);
            console.log(checkedCommentLikeResult);

            // 처음 좋아요 누르는 것이라면
            if (checkedCommentLikeResult[0].success == 0){
                // 칼럼 추가
                await this.CommentModel.insertCommentLike(connection, userIdx, commentIdx);

                await connection.commit();
                return response(baseResponse.SUCCESS);
            }

            // 한 번 취소된 상태라면 이미 존재하는 status를 업데이트
            const commentLikeResult = await this.CommentModel.updateCommentLike(connection, userIdx, commentIdx);

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
    createCommentDislike = async (userIdx, commentIdx) => {
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            const commentLikeResult = await this.CommentModel.updateCommentDislike(connection, userIdx, commentIdx);

            connection.release();
            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 댓글 신고
    createCommentReport = async (userIdx, commentIdx, reportCode) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const commentReportResult = await this.CommentModel.checkCommentReport(connection, userIdx, commentIdx);

            // 이미 신고된 댓글이라면
            if (commentReportResult[0].success == 1){
                await connection.commit();
                
                // 이미 신고된 댓글임을 사용자에게 알리기
                return errResponse(baseResponse.REPORT_ENTERED);
            }
            const reportCommentResult = await this.CommentModel.insertCommentReport(connection, userIdx, commentIdx, reportCode);
            const reportCommentIdx = reportCommentResult.insertId;
            await this.CommentModel.insertReportLog(connection, reportCommentIdx,1, 1, 0);

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
}


module.exports = CommentService;