const adminService = require('../services/admin.service');

const baseResponse = require('../utilities/baseResponseStatus');
const { errResponse, response } = require('../utilities/response');
const regexDate = new RegExp(/(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/); // YYYYMMDD 확인 정규표현식


// 회원 전체 정보 검색
exports.getUserList = async (req, res) => {

    let { id, name, signUpDate, status, page } = req.query;
    
    if (!page){
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    }
    if (signUpDate !== undefined && !regexDate.test(signUpDate)) {
        return res.send(errResponse(baseResponse.ADMIN_DATE_REGEX));
    }
    
    const retrieveUserResult = await adminService.retrieveUserList(id, name, signUpDate, status, page);

    return res.send(retrieveUserResult);
}

// 회원 상세 정보 보기
exports.getUserDetailList = async (req, res) => {
    const userIdx = req.params.userIdx;
    if (!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else if (userIdx.length < 1) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }
    const retrieveUserDetailResult = await adminService.retrieveUserDetailList(userIdx);

    return res.send(retrieveUserDetailResult);
}

// 회원 정지
exports.patchUserStatus = async (req, res) => {

    const userIdx = req.params.userIdx;

    if (!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } 

    const userBanResult = await adminService.sudoBanUser(userIdx);

    return res.send(userBanResult);

}

// 게시글 목록 조회
exports.getPostList = async (req,res) => {
    let { id, postDate, status, page } = req.query;

    if (!page){
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    }
    if (postDate !== undefined && !regexDate.test(postDate)) {
        return res.send(errResponse(baseResponse.ADMIN_DATE_REGEX));
    }

    const retrievePostResult = await adminService.retrievePostList(id, postDate, status, page);

    return res.send(retrievePostResult);
}

// 게시글 상세 정보 조회
exports.getPostDetailList = async (req,res) => {

    const postIdx = req.params.postIdx;

    if (!postIdx){
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    } else if (postIdx.length<1) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    }

    const retrievePostDetailResult = await adminService.retrievePostDetailList(postIdx);

    return res.send(retrievePostDetailResult);
}

// 게시글 삭제
exports.patchPostStatus = async (req, res) => {
    const postIdx = req.params.postIdx;

    if (!postIdx){
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    } else if (postIdx.length<1) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    }

    const postBanResult = await adminService.sudoUpdatePostStatus(postIdx);

    return res.send(postBanResult);
}