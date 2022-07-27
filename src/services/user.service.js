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
        
        // 사용자가 존재하지 않을 때
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


const postSignUp = async (phone, name, password, birth, id) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await pool.getConnection(async (connection) => connection);
        
        const signUpResult = await userModel.insertUser(connection, phone, name, hashedPassword, birth, id);

        connection.release();

        return  
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    } 

}

module.exports = {
    checkUserExists,
    checkUserPassWord,
    postSignUp
};