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

    const userBanResult = await adminService.banUser(userIdx);

    return res.send(userBanResult);

}

exports.getPostList = async (req,res) => {
    let { id, postDate, status, page } = req.query;
    
    // 체크하지 않은 조건들은 null로 치환
    if (id === undefined) id = null
    if (postDate === undefined) postDate = null
    if (status === undefined) status = null

    if (!page){
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
    }
    if (postDate !== null && !regexDate.test(postDate)) {
        return res.send(errResponse(baseResponse.ADMIN_DATE_REGEX));
    }

    const retrievePostResult = await adminService.retrievePostList(id, postDate, status, page);

    return res.send(retrievePostResult);
}