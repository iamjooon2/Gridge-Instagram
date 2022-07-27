const bcrypt = require('bcrypt');
const { pool } = require('../assets/db');
const userModel = require('../models/user.model');
const { errResponse } = require('../utilities/response');
const baseResponse = require('../utilities/baseResponseStatus');

// 사용자의 ID가 존재하는지 확인
const checkUserIdExists = async (userId) => {
    try {
        const connection = await pool.getConnection((connection) => connection);
        const checkedUser = await userModel.checkUserExistsByUserId(connection, userId);

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

// 사용자의 비밀번호가 일치하는지 확인
const checkUserPassword = async (userId, userPassword) => {

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

// 회원정보 데이터베이스에 넣기
const postSignUp = async (phone, name, password, birth, id) => {
    try {
        // 비밀번호 암호화
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

// 소셜 회원 검증
const checkSocialId = async (socialId) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const checkedResult = await userModel.getSocialId(conn, socialId);

        connection.release();
        
        // 사용자가 존재하지 않을 때
        if (checkedResult == 0){
            return false;
        }
        return true;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    } 
}

// 카카오ID로 유저 식별자 가지고오기
const retrieveUserIdxByKakaoId = async (socialId) => {
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const userIdxResult = await userModel.getUserIdxBySocialId(connection, socialId);

        connection.release();

        return userIdxResult;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const retrieveUserIdxById = async (userId) =>{
    try {
        const connection = await pool.getConnection(async (connection) => connection);
        const userIdx = await userModel.getUserIdxByUserId(connection, userId);

        connection.release();

        return userIdx;
    } catch (e){
        console.log(e);
        return errResponse(baseResponse.DB_ERROR);
    } 

}

module.exports = {
    checkUserIdExists,
    checkUserPassword,
    postSignUp,
    checkSocialId,
    retrieveUserIdxByKakaoId,
    retrieveUserIdxById
};