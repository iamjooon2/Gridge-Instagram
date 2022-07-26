const selectByUserId =  async (conn, userId) => {
    const selectByUserIdQuery = `
        SELECT id
        FROM user
        WHERE ID = ?
    `;
    const [userRow] = await conn.query(selectByUserIdQuery, userId);
    console.log(userRow);
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

module.exports = {
    selectByUserId,
    checkUserPassword
}