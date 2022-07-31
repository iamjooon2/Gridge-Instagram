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

const selectPostContent = async (connection, postIdx) => {
    const selectPostContentQuery = `
        SELECT user.id, post.content, 
            case
                when timestampdiff(minute, post.createdAt, current_timestamp) < 60
                    then CONCAT(TIMESTAMPDIFF(minute, post.createdAt , NOW()), '분')
                when timestampdiff(hour , post.createdAt, current_timestamp) < 24
                    then CONCAT(TIMESTAMPDIFF(hour, post.createdAt , NOW()), '시간')
                when timestampdiff(day, post.createdAt, current_timestamp) < 30 
                    then CONCAT(TIMESTAMPDIFF(day, post.createdAt, NOW()), '일')
                else 
                    timestampdiff(year , post.createdAt, current_timestamp)
            end as uploadTime
        FROM post
            join user on post.userIdx = user.userIdx
        WHERE post.postIdx = ?
    `;
    const [postContentRow] = await connection.query(selectPostContentQuery, postIdx);

    return postContentRow
}

const checkPostLike = async (connection, userIdx, postIdx) => {
    const checkPostLikeQuery = `
        SELECT EXISTS (
            SELECT postLikeIdx
            FROM postLike
            WHERE postIdx = ? and userIdx = ?
            limit 1
        ) as success
    `;

    const [postLikeResult] = await connection.query(checkPostLikeQuery, [postIdx, userIdx]);

    return postLikeResult;
}

const updatePostLike = async (connection, userIdx, postIdx) => {
    const checkPostLikeQuery = `
        UPDATE postLike
        SET status = 0
        WHERE postIdx = ? and userIdx = ?
    `;

    const [updatedPostLikeResult] = await connection.query(checkPostLikeQuery, [postIdx, userIdx]);

    return updatedPostLikeResult;
}

const insertPostLike = async (connection, userIdx, postIdx) => {
    const insertPostLikeQuery = `
        INSERT INTO postLike(userIdx, postIdx)
        values(?,?)
    `;
    const [insertedPostLikeResult] = await connection.query(insertPostLikeQuery, [userIdx, postIdx]);

    return insertedPostLikeResult;
}

const updatePostDislike = async (connection, userIdx, postIdx) => {
    const checkPostLikeQuery = `
        UPDATE postLike
        SET status = 1
        WHERE postIdx = ? and userIdx = ?
    `;

    const [updatedPostLikeResult] = await connection.query(checkPostLikeQuery, [postIdx, userIdx]);

    return updatedPostLikeResult;
}

const checkPostReport = async (connection, userIdx, postIdx) => {
    const checkPostReportQuery = `
        SELECT EXISTS (
            SELECT postReportIdx
            FROM postReport
            WHERE reporterIdx = ? and postIdx = ? 
            limit 1
        ) as success
    `;

    const [postCheckResult] = await connection.query(checkPostReportQuery, [userIdx, postIdx]);

    return postCheckResult;
}

const insertPostReport = async (connection, userIdx, postIdx, reportCode) => {
    const insertPostReportQuery = `
        INSERT INTO postReport(reporterIdx, postIdx, reportCode)
        VALUES(?,?,?)
    `;

    const [postReportResult] = await connection.query(insertPostReportQuery, [userIdx, postIdx, reportCode]);

    return postReportResult;
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
    selectPostContent,
    checkPostLike,
    updatePostLike,
    insertPostLike,
    updatePostDislike,
    checkPostReport,
    insertPostReport
}
    