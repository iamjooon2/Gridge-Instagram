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

const selectPostComments = async (conn, postIdx, cursorTime) => {
    const selectPostCommentsQuery = `
        SELECT user.id, comment.commentIdx, comment.content, 
        case
            when timestampdiff(minute, comment.createdAt, current_timestamp) < 60
                then CONCAT(TIMESTAMPDIFF(minute, comment.createdAt , NOW()), '분')
            when timestampdiff(hour , comment.createdAt, current_timestamp) < 24
                then CONCAT(TIMESTAMPDIFF(hour, comment.createdAt , NOW()), '시간')
            when timestampdiff(day, comment.createdAt, current_timestamp) < 30 
                then CONCAT(TIMESTAMPDIFF(day, comment.createdAt, NOW()), '일')
            else 
                timestampdiff(year , comment.createdAt, current_timestamp)
        end as uploadTime
        FROM comment
            join user 
                on comment.userIdx = user.userIdx
        WHERE comment.postIdx = ${postIdx} and comment.status = 0 and comment.createdAt <= ${cursorTime} 
        ORDER BY comment.commentIdx ASC
        limit 10
    `;
    const [selectedCommentsRow] = await conn.query(selectPostCommentsQuery);

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