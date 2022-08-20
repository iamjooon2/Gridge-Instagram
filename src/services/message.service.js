const MessageModel = require('../models/message.model');
const RoomModel = require('../models/room.model');
class MessageService {

    MessageModel;
    RoomModel;

    constructor(pool, baseResponse, errResponse, response){
        this.pool = pool;
        this.baseResponse = baseResponse;
        this.errResponse = errResponse;
        this.response = response;
        this.MessageModel = new MessageModel();
        this.RoomModel = new RoomModel();
    }

    postMessage = async (userIdx, partnerIdx, content) => {
        const connection = await this.pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();
    
            const userParams = [userIdx, partnerIdx];
            const userDoubleParams = [userIdx, partnerIdx, partnerIdx, userIdx];
            let selectedRoomInfoResult = await this.RoomModel.selectRoom(connection, userDoubleParams);
    
            if (selectedRoomInfoResult[0] == null){
                await this.RoomModel.startMessageRoom(connection, userParams);
    
                selectedRoomInfoResult = await this.roomModel.selectRoom(connection, userDoubleParams);
            }
            
            const roomIdx = selectedRoomInfoResult[0].roomIdx;
            const postMessageParams = [roomIdx, userIdx, content];
    
            await this.messageModel.insertMessage(connection, postMessageParams);
            
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

    getMessages = async (userIdx, partnerIdx) => {
        try {
            const connection = await this.pool.getConnection(async (conn) => conn);
            
            const memberParams = [userIdx, partnerIdx, partnerIdx, userIdx];
            const getMessageResult = await this.MessageModel.selectMessages(connection, memberParams);
            
            connection.release();
    
            return response(baseResponse.SUCCESS, getMessageResult);
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

}

module.exports = MessageService;