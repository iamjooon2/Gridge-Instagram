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

const selectUserPosts = async (connection, userIdx, page) => {
    const selectUserPostsQuery = `
        SELECT p.postIdx as postIdx, pi.imgUrl as postImgUrl
        FROM post as p
            join postImg as pi
                on pi.postIdx = p.postIdx and pi.status = 0
            join user as u 
                on u.userIdx = p.userIdx
        WHERE p.status = 0 and u.userIdx = ${userIdx}
        ORDER BY p.postIdx
        LIMIT 9 OFFSET ${page}
    `;
    const [postRows] = await connection.query(selectUserPostsQuery);

    return postRows;

}

const selectPostImgs = async (connection, postIdx) => {
    const selectPostImgsQuery = `
        SELECT pi.postImgIdx, pi.imgUrl
        FROM postImg as pi
            join post as p on p.postIdx = pi.postIdx
        WHERE pi.status = 0 and p.postIdx = ?;
        ORDER BY p.postIdx
    `;

    const [postImgRows] = await connection.query(selectPostImgsQuery, postIdx);

    return postImgRows;
}

const selectPostStatus = async (connection, postIdx) => {
    const selectPostStatusQuery = `
        SELECT status
        FROM post
        WHERE postIdx = ?;
    `;

    const [postStatusRow] = await connection.query(selectPostStatusQuery, postIdx);

    return postStatusRow;
}

const updatePostStatusInactive = async (connection, postIdx) => {
    const updatePostStatusQuery = `
        UPDATE post
        SET status = 1
        WHERE postIdx = ?;
    `;

    const updatePostStatusRow = await connection.query(updatePostStatusQuery, postIdx);

    return updatePostStatusRow[0];
}


module.exports = {
    insertPost,
    insertPostImg,
    updatePost,
    selectPostByPostIdx,
    selectUserIdxByPostIdx,
    selectUserPosts,
    selectPostImgs,
    selectPostStatus,
    updatePostStatusInactive,
}
    