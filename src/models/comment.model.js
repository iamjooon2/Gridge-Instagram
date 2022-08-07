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
            when timestampdiff(minute, comment.updatedAt, current_timestamp) < 60
                then CONCAT(TIMESTAMPDIFF(minute, comment.updatedAt , NOW()), '분')
            when timestampdiff(hour , comment.updatedAt, current_timestamp) < 24
                then CONCAT(TIMESTAMPDIFF(hour, comment.updatedAt , NOW()), '시간')
            when timestampdiff(day, comment.updatedAt, current_timestamp) < 30 
                then CONCAT(TIMESTAMPDIFF(day, comment.updatedAt, NOW()), '일')
            else 
                timestampdiff(year , comment.updatedAt, current_timestamp)
        end as uploadTime
        FROM comment
            join user 
                on comment.userIdx = user.userIdx
        WHERE comment.postIdx = ? and comment.status = 0 and comment.updatedAt <= ? 
        ORDER BY comment.commentIdx ASC
        limit 10
    `;
    const [selectedCommentsRow] = await conn.query(selectPostCommentsQuery, [postIdx, cursorTime]);

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

const checkCommentLike = async (connection, userIdx, commentIdx) => {
    const checkCommentLikeQuery = `
        SELECT EXISTS (
            SELECT commentLikeIdx
            FROM commentLike
            WHERE commentIdx = ? and userIdx = ? and status = 0
            limit 1
        ) as success
    `;

    const [commentLikeResult] = await connection.query(checkCommentLikeQuery, [commentIdx, userIdx]);

    return commentLikeResult;
}

const updateCommentLike = async (connection, userIdx, commentIdx) => {
    const checkCommentLikeQuery = `
        UPDATE commentLike
        SET status = 0
        WHERE commentIdx = ? and userIdx = ?
    `;

    const [updatedCommentLikeResult] = await connection.query(checkCommentLikeQuery, [commentIdx, userIdx]);

    return updatedCommentLikeResult;
}

const insertCommentLike = async (connection, userIdx, commentIdx) => {
    const insertCommentLikeQuery = `
        INSERT INTO commentLike(userIdx, commentIdx)
        values(?,?)
    `;
    const [insertedCommentLikeResult] = await connection.query(insertCommentLikeQuery, [userIdx, commentIdx]);

    return insertedCommentLikeResult;
}

const updateCommentDislike = async (connection, userIdx, commentIdx) => {
    const checkCommentLikeQuery = `
        UPDATE commentLike
        SET status = 1
        WHERE commentIdx = ? and userIdx = ?
    `;

    const [updatedPostLikeResult] = await connection.query(checkCommentLikeQuery, [commentIdx, userIdx]);

    return updatedPostLikeResult;
}

const checkCommentReport = async (connection, commentIdx, userIdx) => {
    const checkCommentReportQuery = `
        SELECT EXISTS (
            SELECT commentReportIdx
            FROM commentReport
            WHERE commentIdx = ? and reporterIdx = ?
            limit 1
        ) as success
    `;

    const [commentReportResult] = await connection.query(checkCommentReportQuery, [commentIdx, userIdx]);

    return commentReportResult;
}

const insertCommentReport = async (connection, userIdx, commentIdx, reportCode) => {
    const insertCommentReportQuery = `
        INSERT INTO commentReport(reporterIdx, commentIdx, reportCode)
        VALUES(?,?,?)
    `;

    const [postReportResult] = await connection.query(insertCommentReportQuery, [userIdx, commentIdx, reportCode]);

    return postReportResult;
}

const insertCommetLog = async (conn, userIdx, logType) => {
    const insertLogQuery = `
        INSERT INTO commentLog(commentIdx, logType)
        VALUES(?,?)
    `;
    
    const [LogRow] = await conn.query(insertLogQuery, [userIdx, logType]);

    return LogRow;
}

const insertReportLog = async (conn, commentReportIdx, reportType, logType) => {
    const insertLogQuery = `
        INSERT INTO reportLog(postReportIdx, reportType, logType)
        VALUES(?,?,?)
    `;
    
    const [LogRow] = await conn.query(insertLogQuery, [commentReportIdx, reportType, logType]);

    return LogRow;
}

const selectCommentIdxByPostIdx = async (conn, postIdx) => {
    const selectCommentIdxQuery = `
        SELECT commentIdx
        FROM comment
        WHERE postIdx = ?
    `;
    const [commentResult] = await conn.query(selectCommentIdxQuery, postIdx);

    return commentResult;
}

module.exports = {
    insertComment,
    updateComment,
    selectUserIdxByCommentIdx,
    selectPostComments,
    selectCommentStatus,
    updateCommentStatusInactive,
    checkCommentLike,
    updateCommentLike,
    insertCommentLike,
    updateCommentDislike,
    checkCommentReport,
    insertCommentReport,
    insertCommetLog,
    insertReportLog,
    selectCommentIdxByPostIdx
}