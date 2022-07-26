const PostService = require('../services/post.service');

const baseResponse = require('../utilities/baseResponseStatus');
const {errResponse, response} = require('../utilities/response');

    
exports.postPost = async (req, res) => {

    const userIdxFromToken = req.verifiedToken.idx;

    const { userIdx, postImgUrls, content} = req.body;

    // Authentication
    if (userIdxFromToken != userIdx){
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    // validation
    if (!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else if(postImgUrls.length <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIMGURLS_EMPTY));
    }

    if(userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    } else if (content.length > 450) {
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const createdPostResult = await this.postService.createPost(
        userIdx,
        postImgUrls,
        content
    );

    return res.send(createdPostResult);
}