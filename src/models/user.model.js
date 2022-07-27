const selectByUserId =  async (conn, userId) => {
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

module.exports = {
    selectByUserId,
    checkUserPassword,
    insertUser
}
