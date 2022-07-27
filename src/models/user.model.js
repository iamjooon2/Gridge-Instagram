const checkUserExistsByUserId =  async (conn, userId) => {
    const selectByUserIdQuery = `
        SELECT id
        FROM user
        WHERE ID = ?
    `;
    const [userRow] = await conn.query(selectByUserIdQuery, userId);

    return userRow;
}

const checkUserPassword = async (conn, userId) => {
    const checkUserPasswordQuery = `
        SELECT password
        FROM user
        WHERE ID = ?
    `;
    const [checkRow] = await conn.query(checkUserPasswordQuery, userId);
    
    return checkRow;
}

const insertUser = async (conn, phone, name, hashedPassword, birth, id) => {
    const insertUserQuery = `
        INSERT INTO user(phone, name, password, birth, ID)
        VALUES(?,?,?,?,?)
    ;`;
    const [insertedRow] = await conn.query(insertUserQuery, [phone, name, hashedPassword, birth, id]);

    return insertedRow;
}

const insertSocialUser = async (conn, phone, name, hashedPassword, birth, id, socialId) => {
    const insertUserQuery = `
        INSERT INTO user(phone, name, password, birth, ID, socialId, userType)
        VALUES(?,?,?,?,?,?,?)
    ;`;
    const [insertedRow] = await conn.query(insertUserQuery, [phone, name, hashedPassword, birth, id, socialId, 1]);

    return insertedRow;
}

const getSocialId = async (conn, socialId) => {
    const getSocialIdQuery = `
        SELECT socialId
        FROM user
        WHERE socialId = ?
    `;
    const [userRow] = await conn.query(getSocialIdQuery, socialId);

    return userRow;
}

const getUserIdxBySocialId = async (conn, socialId) => {
    const getUserIdxBySocialIdQuery = `
        SELECT userIdx
        FROM user
        WHERE socialId = ?
    `;
    const [userRow] = await conn.query(getUserIdxBySocialIdQuery, socialId);

    return userRow;
}

const getUserIdxByUserId = async (conn, userId) => {
    const getUserIdxByUserIdQuery = `
        SELECT userIdx
        FROM user
        WHERE ID = ?
    `;
    const [userRow] = await conn.query(getUserIdxByUserIdQuery, userId);

    return userRow;
}

module.exports = {
    checkUserExistsByUserId,
    checkUserPassword,
    insertUser,
    insertSocialUser,
    getSocialId,
    getUserIdxBySocialId,
    getUserIdxByUserId
}
