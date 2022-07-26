const insertPost = async (connection, insertPostParams) => {
    const insertPostQuery = `
        INSERT INTO post(userIdx, content)
        values(?,?)
    `;
    const insertPostRow = await connection.query(insertPostQuery, insertPostParams);

    return insertPostRow;
}

const insertPostImg = async (connection, insertPostImgParams) => {
    const insertPostImgQuery = `
        INSERT INTO postImg(postIdx ,imgUrl)
        values(?,?)
    `;
    const insertPostImgRow = await connection.query(insertPostImgQuery, insertPostImgParams);

    return insertPostImgRow;
}