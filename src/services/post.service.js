const { pool } = require('../assets/db');

const postModel = require('../models/post.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

// 게시물 생성
const createPost = async ( userIdx, postImgUrls, content) => {
    const connection = await pool.getConnection(async (connection) => connection);
    try {
        await connection.beginTransaction();

        const insertPostParams =  [userIdx, content];
        const postResult = await postModel.insertPost(connection, insertPostParams);
        const postIdx = postResult.insertId;

        for (postImgUrl of postImgUrls) {
            const insertPostImgParams = [postIdx, postImgUrl];
            postImgResult = await postModel.insertPostImg(connection, insertPostImgParams);
        }

        await connection.commit();

        return 
    } catch (e) {
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        await connection.release();
    }
}

// 게시물 수정
const updatePost = async (content, postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const editPostParams = [content, postIdx];
        const editPostResult = await postModel.updatePost(connection, editPostParams);

        if (!editPostResult) {
            return errResponse(baseResponse.DB_ERROR);
        }

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (e){
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시물 작성자 확인
const retrieveUserIdx = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const userIdx = await postModel.selectUserIdxByPostIdx(connection, postIdx);
        
        connection.release();

        return userIdx;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글 목록 조회
const retrievePostLists = async (userIdx, page) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const offset = (page-1)*9;
        const postListResult = await postModel.selectUserPosts(connection, userIdx, offset);
        
        
        connection.release()

        return postListResult;

    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시물 상태 비활성화로 변경(사용자입장 삭제)
const updatePostStatus = async (postIdx) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const postStatusResult = await postModel.selectPostStatus(connection, postIdx);

        if (postStatusResult[0].status !== 0) {
            return errResponse(baseResponse.POST_STATUS_INACTIVE);
        }

        const editPostStatusResult = await postModel.updatePostStatusInactive(connection, postIdx);

        return response(baseResponse.SUCCESS);
    } catch(e) {
        console.log(e);

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 게시물 내용 조회
const retrievePostContent = async (postIdx) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const checkPostRealizeList = await postModel.selectPostByPostIdx(connection, postIdx);
        
        if (!checkPostRealizeList) {
            return errResponse(baseResponse.DB_ERROR);
        }

        const postContentResult = await postModel.selectPostContent(connection, postIdx);
        
        connection.release()

        return response(baseResponse.SUCCESS, postContentResult);
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글 좋아요 
const createPostLike = async (userIdx, postIdx) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const checkedPostLikeResult = await postModel.checkPostLike(connection, userIdx, postIdx);

        if (checkedPostLikeResult[0].success == 0){
            await postModel.insertPostLike(connection, userIdx, postIdx);

            await connection.commit();
            return response(baseResponse.SUCCESS);
        }

        const postLikeResult = await postModel.updatePostLike(connection, userIdx, postIdx);

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

// 게시글 좋아요 해제
const createPostDislike = async (userIdx, postIdx) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postLikeResult = await postModel.updatePostDislike(connection, userIdx, postIdx);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (e) {
        console.log(e);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 게시글 신고
const createPostReport = async (userIdx, postIdx, reportCode) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const postReportResult = await postModel.checkPostReport(connection, userIdx, postIdx);

        // 이미 신고된 게시물이라면
         if (postReportResult[0].success == 1){
            await connection.commit();
            
            // 이미 신고된 게시물임을 사용자에게 알리기
            return errResponse(baseResponse.REPORT_ENTERED);
        }
        await postModel.insertPostReport(connection, userIdx, postIdx, reportCode);

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
    createPost,
    updatePost,
    retrieveUserIdx,
    retrievePostLists,  
    updatePostStatus,
    retrievePostContent,
    createPostLike,
    createPostDislike,
    createPostReport
}