const { pool } = require('../assets/db');

const messageModel = require('../models/message.model');
const roomModel = require('../models/room.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

const postMessage = async (userIdx, partnerIdx, content) => {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();

        const userParams = [userIdx, partnerIdx];
        const userDoubleParams = [userIdx, partnerIdx, partnerIdx, userIdx];
        let selectedRoomInfoResult = await roomModel.selectRoom(connection, userDoubleParams);

        if (!selectedRoomInfoResult){
            await roomModel.startMessageRoom(connection, userParams);

            selectedRoomInfoResult = await roomModel.selectRoom(connection, userDoubleParams);
        }
        
        const roomIdx = selectedRoomInfoResult[0].roomIdx;
        const postMessageParams = [roomIdx, userIdx, content];

        const postMessageResult = await messageModel.insertMessage(connection, postMessageParams);
        
        await connection.commit();

        return response(baseResponse.SUCCESS);
    } catch (e){
        console.log(e);
        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

const getMessages = async (userIdx, partnerIdx) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        const memberParams = [userIdx, partnerIdx];
        const getMessageResult = await messageModel.selectMessages(connection, memberParams);
        
        connection.release();

        return response(baseResponse.SUCCESS, getMessageResult);
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }

}

module.exports = {
    postMessage,
    getMessages
};