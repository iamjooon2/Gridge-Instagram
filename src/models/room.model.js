const startMessageRoom = async (connection, userParmas) => {
    const insertRoomQuery = `
        INSERT INTO room(user_1, user_2)
        values(?,?)
    `;

    const [insertRoomResult] = await connection.query(insertRoomQuery, userParmas);

    return insertRoomResult;
}

const selectRoom = async (connection, userParmas) => {
    const selectRoomQuery = `
        SELECT roomIdx
        FROM room
        WHERE (user_1 = ? and user_2 = ?) or (user_2 = ? and user_1 = ?) 
    `;
    
    const [selectRoomResult] = await connection.query(selectRoomQuery, userParmas, userParmas);

    return selectRoomResult;
}

module.exports = {
    selectRoom,
    startMessageRoom
}