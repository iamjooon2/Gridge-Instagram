const commentService = require('../services/comment.service');

const baseResponse = require('../utilities/baseResponseStatus');
const {errResponse, response} = require('../utilities/response');


// 댓글 등록
const postComment = async (req, res) => {

    const token = req.verifiedToken.idx;
    const userIdxFromToken = token[0].userIdx;

    const { userIdx, postIdx, content} = req.body;

    // Authentication
    if ( userIdxFromToken != userIdx){
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    // validation
    if (!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else  if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }

    if (!postIdx) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    } else  if (postIdx <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    }

    if (!content){
        return res.send(errResponse(baseResponse.COMMENT_CONTENT_EMPTY));
    } else if (content.length > 200) {
        return res.send(errResponse(baseResponse.COMMENT_CONTENT_LENGTH));
    }

    const createdCommentResult = await commentService.createComment(
        userIdx,
        postIdx,
        content
    );

    return res.send(response(baseResponse.SUCCESS));
}

// 댓글 조회
const getComments = async (req, res) => {

    const postIdx = req.params.postIdx;

    // validation
    if(!postIdx) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    }
    if (postIdx <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    }

    const commentListResult = await commentService.retrieveCommentLists(postIdx);

    return res.send(response(baseResponse.SUCCESS, commentListResult));
}

// 댓글 수정
const patchComment = async (req, res) => {

    const idx = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;
    const content = req.body.content;

    const writerOfComment = await commentService.retrieveUserIdx(postIdx);

    // Authentication
    if (writerOfComment[0].userIdx !== idx[0].userIdx) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    // Validation
    if(!commentIdx) {
        return res.send(errResponse(baseResponse.COMMENT_CONTENT_EMPTY));
    }else if (commentIdx < 1) {
        return res.send(errResponse(baseResponse.COMMENT_CONTENT_LENGTH));
    }

    if (!content) {
        return res.send(errResponse(baseResponse.COMMENT_CONTENT_EMPTY))
    }else if (content.length > 200) {
        return res.send(errResponse(baseResponse.COMMENT_CONTENT_LENGTH));
    } 

    const editCommentResponse = await commentService.updateComment(content, postIdx);

    return res.send(editCommentResponse);
}

// 댓글 삭제
const patchCommentStatus = async (req ,res) => {

    const token = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;

    const writerOfComment = await commentService.retrieveUserIdx(postIdx);

    // Authentication
    if (writerOfComment[0].userIdx !== token[0].userIdx) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    
    // validation
    if (!commentIdx) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (commentIdx <= 0) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
    }

    const editCommentStatusResponse = await commentService.updateCommentStatus(postIdx);

    return res.send(editCommentStatusResponse);
}

module.exports = {
    postComment,
    patchComment,
    getComments,
    patchCommentStatus
};