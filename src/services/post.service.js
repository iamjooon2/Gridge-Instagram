const { pool } = require('../assets/db');

const postModel = require('../models/post.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');


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

const retrieveUserIdx = async (postIdx) =>{
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

module.exports ={
    createPost,
    updatePost,
    retrieveUserIdx
}