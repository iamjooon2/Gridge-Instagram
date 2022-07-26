const bcrypt = require('bcrypt');
const { pool } = require('../assets/db');
const userModel = require('../models/user.model');
const {errResponse, response} = require('../utilities/response');
const baseResponse = require('../utilities/baseResponseStatus');

const checkUserExists = async (userId) => {

    try {
        const connection = await pool.getConnection((connection) => connection);
        const checkedUser = await userModel.selectByUserId(connection, userId);

        connection.release();

        if (checkedUser == 0){
            return false;
        }

        return true;

    } catch (e) {
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const checkUserPassWord = async (userId, userPassword) => {

    try {
        const connection = await pool.getConnection((connection) => connection);
        //const hashed = await bcrypt.hash(userPassword, 10);
        const checkedUserPassword = await userModel.checkUserPassword(connection, userId);

        connection.release();

        // DB 저장된 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 확인
        const match = bcrypt.compareSync(userPassword, checkedUserPassword[0]["password"]);
        
        if (!match){
            return false;
        }
        
        return true;

    } catch (e) {
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }

}


// const postSignIn = async (userId, userPassword) => {
//     try {
//         const connection = await pool.getConnection(async (connection) => connection);
//         const loginResult = await userModel.select 

//     } catch (e){

//     } finally{

//     }
// }

module.exports = {
    checkUserExists,
    checkUserPassWord
};