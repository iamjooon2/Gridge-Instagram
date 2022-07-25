const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql2/promise');


const pool = mysql.createPool({

    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    timezone: '+09:00', // 데이터베이스 UTC 시간 관리 - 한국시간으로 설정
    charset: 'utf8mb4', // 데이터베이스 character-set 관리
    insecureAuth: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true,

});


module.exports = { pool };