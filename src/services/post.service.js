const { pool } = require('../assets/db');

const postModel = require('../models/post.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

class PostService {

    createPost = async (userIdx, postImgUrls, content) => {
    
        const connection = await pool.getConnection(async (connection) => connection);
    
        try {
            await connection.beginTransaction();
    
            const insertPostParams =  [userIdx, content];
            const postResult = await postModel.inserPost(connection, insertPostParams);
    
            const postIdx = postResult[0].insertId;
    
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
            connection.release();
        }
    }
    
}

module.exports = PostService;