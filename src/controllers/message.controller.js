const messageService = require('../services/message.service');

const baseResponse = require('../utilities/baseResponseStatus');
const {errResponse, response} = require('../utilities/response');

const postMessage = async (req, res) => {
    const toeknIdxData = req.verifiedToken.idx;
    const userIdx = toeknIdxData[0].userIdx;
    const partnerIdx = req.body.partnerIdx;
    const content = req.body.content;

    // validation
    if (!partnerIdx) {
        return res.send(errResponse(baseResponse.MESSAGE_USERIDX_EMPTY));
    } else if (partnerIdx < 0){
        return res.send(errResponse(baseResponse.MESSAGE_USERIDX_LENGTH));
    }

    // validation
    if (!content) {
        return res.send(errResponse(baseResponse.MESSAGE_CONTENT_EMPTY));
    } else if (content.length >200) {
        return res.send(errResponse(baseResponse.MESSAGE_CONTENT_LENGTH));
    }

    const postMessageResult = await messageService.postMessage(userIdx, partnerIdx, content);

    return res.send(postMessageResult);

}

const getMessages = async (req, res) => {

    const toeknIdxData = req.verifiedToken.idx;
    const userIdx = toeknIdxData[0].userIdx;
    const partnerIdx = req.body.user;

    // validation
    if (!partnerIdx) {
        return res.send(errResponse(baseResponse.MESSAGE_USERIDX_EMPTY));
    } else if (partnerIdx < 0){
        return res.send(errResponse(baseResponse.MESSAGE_USERIDX_LENGTH));
    }

    const totalMessageResult = await messageService.getMessages(userIdx, partnerIdx);

    return res.send(totalMessageResult);
}


module.exports = {
    postMessage,
    getMessages
};