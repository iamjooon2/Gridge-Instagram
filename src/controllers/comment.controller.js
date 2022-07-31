const commentService = require('../services/comment.service');

const baseResponse = require('../utilities/baseResponseStatus');
const {errResponse, response} = require('../utilities/response');


// 댓글 등록
const postComment = async (req, res) => {

    const token = req.verifiedToken.idx;
    const userIdxFromToken = token[0].userIdx;

    const { postIdx, content} = req.body;

    // validation
    if (!userIdxFromToken) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else  if (userIdxFromToken <= 0) {
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
        userIdxFromToken,
        postIdx,
        content
    );

    return res.send(response(baseResponse.SUCCESS));
}

// 댓글 조회
const getComments = async (req, res) => {

    const postIdx = req.params.postIdx;
    const cursorTime = req.query.cursorTime;

    // validation
    if(!postIdx) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    } else if (postIdx <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    }

    if(!cursorTime) {
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    } else if (cursorTime <= 0) {
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    }

    const commentListResult = await commentService.retrieveCommentLists(postIdx, cursorTime);

    return res.send(response(baseResponse.SUCCESS, commentListResult));
}

// 댓글 수정
const patchComment = async (req, res) => {

    const idx = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;
    const content = req.body.content;

    const writerOfComment = await commentService.retrieveUserIdx(commentIdx);

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

    const editCommentResponse = await commentService.updateComment(content, commentIdx);

    return editCommentResponse;
}

// 댓글 삭제
const patchCommentStatus = async (req ,res) => {

    const token = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;

    const writerOfComment = await commentService.retrieveUserIdx(commentIdx);

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

    const editCommentStatusResponse = await commentService.updateCommentStatus(commentIdx);

    return res.send(editCommentStatusResponse);
}

// 댓글 좋아요
const postCommentLike = async (req, res) => {
    const idx = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;

    const userIdx = idx[0].userIdx;

    if(!commentIdx) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (commentIdx < 1) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
    }

    const commentLikeResponse = await commentService.createCommentLike(userIdx, commentIdx);

    return res.send(commentLikeResponse);
}

// 댓글 좋아요 해제
const postCommentDislike = async (req, res) => {
    const idx = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;

    const userIdx = idx[0].userIdx;

    if(!commentIdx) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (commentIdx < 1) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
    }

    const commentDislikeResponse = await commentService.createCommentDislike(userIdx, commentIdx);

    return res.send(commentDislikeResponse);
}

// 댓글 신고
const postCommentReport = async (req, res) => {
    const idx = req.verifiedToken.idx;
    const commentIdx = req.params.commentIdx;
    // 신고구분: 1-욕설, 2-스팸 등의 형식으로 종류를 구분한 코드를 클라이언트로부터 넘겨받는다 가정
    const reportCode = req.query.reportCode;

    const userIdx = idx[0].userIdx;

    // 댓글 validation
    if(!commentIdx) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (commentIdx < 1) {
        return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
    }
    // 신고구분 validation
    if(!reportCode) {
        return res.send(errResponse(baseResponse.REPORT_CODE_EMPTY));
    }

    const commentReportResponse = await commentService.createCommentReport(userIdx, commentIdx, reportCode);

    return res.send(commentReportResponse);
}
module.exports = {
    postComment,
    patchComment,
    getComments,
    patchCommentStatus,
    postCommentLike,
    postCommentDislike,
    postCommentReport
};