const postService = require('../services/post.service');

const baseResponse = require('../utilities/baseResponseStatus');
const {errResponse, response} = require('../utilities/response');


// 게시글 등록
const postPost = async (req, res) => {

    const userIdxFromToken = req.verifiedToken.idx;

    const { userIdx, postImgUrls, content} = req.body;

    // Authentication
    if ( userIdxFromToken[0].userIdx != userIdx){
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    // validation
    if (!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else if(postImgUrls.length <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIMGURLS_EMPTY));
    }

    if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    } else if (content.length > 1000) {
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const createdPostResult = await postService.createPost(
        userIdx,
        postImgUrls,
        content
    );

    return res.send(response(baseResponse.SUCCESS));
}

// 게시글 수정
const patchPost = async (req, res) => {

    const idx = req.verifiedToken.idx;
    const postIdx = req.params.postIdx;
    const content = req.body.content;

    const writerOfPost = await postService.retrieveUserIdx(postIdx);

    if (writerOfPost[0].userIdx !== idx[0].userIdx) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if(!postIdx) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    }else if (postIdx < 1) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    }

    if(!content) {
        return res.send(errResponse(baseResponse.POST_CONTENT_EMPTY))
    }else if (content.length > 1000) {
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    } 

    const editPostResponse = await postService.updatePost(content, postIdx);

    return res.send(editPostResponse);
}
module.exports = {
    postPost,
    patchPost
};