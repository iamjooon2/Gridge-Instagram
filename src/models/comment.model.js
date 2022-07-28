const insertComment = async (conn, commentParmas) => {
    const insertCommentQuery = `
        INSERT INTO comment(userIdx, postIdx, content)
        values(?,?,?)
    `;
    const [commentRow] = await conn.query(insertCommentQuery, commentParmas);

    return commentRow;
}

const updateComment = async (conn, updateCommentParam) => {
    const updateCommentQuery = `
        UPDATE comment
        SET content = ?
        WHERE commentIdx = ?
    `;
    const [commentRow] = await conn.query(updateCommentQuery, updateCommentParam);

    return commentRow;
}

const selectUserIdxByCommentIdx = async (conn, commentIdx) => {
    const selectUserIdxByCommentIdxQuery = `
        SELECT userIdx
        FROM comment
        WHERE commentIdx = ?
    `;
    const [selectedUserRow] = await conn.query(selectUserIdxByCommentIdxQuery, commentIdx);

    return selectedUserRow;
}

const selectPostComments = async (conn, postIdx) => {
    const selectPostCommentsQuery = `
        SELECT comment
        FROM post
        WHERE postIdx = ?
    `;
    const [selectedCommentsRow] = await conn.query(selectPostCommentsQuery, postIdx);

    return selectedCommentsRow;
}

const selectCommentStatus = async (conn, commentIdx) => {
    const selectCommentStatusQuery = `
        SELECT status
        FROM comment
        WHERE commentIdx = ?
    `;
    const [selectedCommentStatusRow] = await conn.query(selectCommentStatusQuery, commentIdx);

    return selectedCommentStatusRow;
}

const updateCommentStatusInactive = async (conn, commentIdx) => {
    const updateCommentStatusQuery = `
        UPDATE comment
        SET status = 1
        WHERE commentIdx = ?;
    `;
    const [selectedCommentRow] = await conn.query(updateCommentStatusQuery, commentIdx);

    return selectedCommentRow;
}

module.exports = {
    insertComment,
    updateComment,
    selectUserIdxByCommentIdx,
    selectPostComments,
    selectCommentStatus,
    updateCommentStatusInactive
}