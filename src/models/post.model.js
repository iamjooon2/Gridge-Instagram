const insertPost = async (connection, insertPostParams) => {
    const insertPostQuery = `
        INSERT INTO post(userIdx, content)
        values(?,?)
    `;
    const [insertPostRow] = await connection.query(insertPostQuery, insertPostParams);

    return insertPostRow;
}

const insertPostImg = async (connection, insertPostImgParams) => {
    const insertPostImgQuery = `
        INSERT INTO postImg(postIdx ,imgUrl)
        values(?,?)
    `;
    const [insertPostImgRow] = await connection.query(insertPostImgQuery, insertPostImgParams);

    return insertPostImgRow;
}

const updatePost = async (connection, editPostParams) => {
    const updatePostQuery = `
        UPDATE post
        SET content = ?
        WHERE postIdx = ?
    `;
    const [updatePostRow] = await connection.query(updatePostQuery, editPostParams);

    return updatePostRow;
};

const selectPostByPostIdx = async (connection, postIdx) => {
    const selectPostByPostIdxQuery = `
        SELECT postIdx, content
        FROM post
        Where PostIdx = ?
    `;
    const [selectedPostRow] = await connection.query(selectPostByPostIdxQuery, postIdx);

    return selectedPostRow;
}

const selectUserIdxByPostIdx = async (connection, postIdx) => {
    const selectUserIdxByPostIdxQuery = `
        SELECT userIdx
        FROM post
        WHERE postIdx = ?
    `;
    const [selectedUserRow] = await connection.query(selectUserIdxByPostIdxQuery, postIdx);

    return selectedUserRow;
}
module.exports = {
    insertPost,
    insertPostImg,
    updatePost,
    selectPostByPostIdx,
    selectUserIdxByPostIdx
}