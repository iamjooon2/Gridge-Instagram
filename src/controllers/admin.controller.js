const adminService = require('../services/admin.service');

const baseResponse = require('../utilities/baseResponseStatus');
const { errResponse, response } = require('../utilities/response');

// 회원 전체 정보 검색
exports.getUserList = async (req, res) => {

    let { id, name, signUpDate, status, page } = req.query;
    
    // 체크하지 않은 조건들은 null로 치환
    if (name === undefined) name = null
    if (id === undefined) id = null
    if (signUpDate === undefined) signUpDate = null
    if (status === undefined) status = null

    if (!page){
        return res.send(errResponse(baseResponse.PAGENATION_ERROR));
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
exports.postUserBan = async (req, res) => {

    const userIdx = req.params.userIdx;

    if (!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } 

    const userBanResult = await adminService.banUser(userIdx);

    return res.send(userBanResult);

}