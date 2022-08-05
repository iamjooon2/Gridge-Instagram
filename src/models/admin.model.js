const selectUserList = async (conn, id, name, signUpDate, status, offset) => {
    const adminSelectUserQuery = `
        SELECT *
        FROM user
        WHERE ID = ${id} and name = ${name} and DATE(createdAt) = DATE(${signUpDate}) and status = ${status}
        LIMIT 10 offset ${offset}
    `;

    const [userRow] = await conn.query(adminSelectUserQuery);

    return userRow;
}

const selectUserLastLoginTime = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT loginTime
        FROM user
        WHERE userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;

}

const selectUserProfileImgByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM userProfileImg
        WHERE userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserPostByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM post
        where userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserPostLikeByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM postLike
        where userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserPostReportByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM postReport
        where reporterIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserCommentByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM comment
        where userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserCommentLikeByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM commentLike
        where userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserCommentReportByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM commentReport
        where reporterIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserFollowingByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM following
        where userIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserFollowerByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM following
        where targetUserIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const selectUserMessageByUserIdx = async (conn, userIdx) => {
    const selectUserEverythingQuery = `
        SELECT *
        FROM message
        where senderIdx = ?
    `;
    const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
    
    return userRow;
}

const updateUserStatus = async (conn, userIdx) => {
    const updateUserStatusQuery = `
        UPDATE user
        SET status = 3
        WHERE userIdx = ?
    `;
    const [userRow] = await conn.query(updateUserStatusQuery, userIdx);
    
    return userRow;
}

const selectPostList = async (conn, id, postDate, status, offset) => {
    const adminSelectListQuery = `
        SELECT *
        FROM post
        WHERE userIdx = (
                        SELECT user.userIdx
                        FROM user
                        WHERE ID = ${id}
                        ) and DATE(createdAt) = DATE(${postDate}) 
                        and status = ${status} 
        ORDER BY createdAt ASC
        LIMIT 10 offset ${offset}
    `;

    const [userRow] = await conn.query(adminSelectListQuery);

    return userRow;
}

const selectPostByPostIdx = async (conn, postIdx) => {
    const selectPostEverythingQuery = `
        SELECT *
        FROM post
        WHERE postIdx = ?
    `;
    const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
    
    return postRow;
}

const selectPostImgByPostIdx = async (conn, postIdx) => {
    const selectPostEverythingQuery = `
        SELECT *
        FROM postImg
        WHERE postIdx = ?
    `;
    const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
    
    return postRow;
}

const selectPostLikeByPostIdx = async (conn, postIdx) => {
    const selectPostEverythingQuery = `
        SELECT COUNT(postIdx) as '좋아요 개수'
        FROM postLike
        WHERE postIdx = ?
    `;
    const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
    
    return postRow;
}

const selectPostReportByPostIdx = async (conn, postIdx) => {
    const selectPostEverythingQuery = `
        SELECT *
        FROM postReport
        WHERE postIdx = ?
    `;
    const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
    
    return postRow;
}

const selectPostCommentByPostIdx = async (conn, postIdx) => {
    const selectPostEverythingQuery = `
        SELECT *
        FROM comment
        WHERE postIdx = ?
    `;
    const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
    
    return postRow;
}

const updatePostStatus = async (conn, postIdx) => {
    const updatePostStatusQuery = `
        UPDATE post
        set status = 3
        WHERE postIdx = ?
    `;
    const [postResult] = await conn.query(updatePostStatusQuery, postIdx)

    return postResult;
}

const updateCommentStatus = async (conn, postIdx) => {
    const updateCommentStatusQuery = `
        UPDATE comment
        set status = 3
        WHERE postIdx = ?
    `;
    const [postResult] = await conn.query(updateCommentStatusQuery, postIdx)

    return postResult;
}


module.exports = {
    selectUserList,
    selectUserLastLoginTime,
    selectUserPostByUserIdx,
    selectUserPostLikeByUserIdx,
    selectUserProfileImgByUserIdx,
    selectUserPostReportByUserIdx,
    selectUserCommentByUserIdx,
    selectUserCommentLikeByUserIdx,
    selectUserCommentReportByUserIdx,
    selectUserFollowingByUserIdx,
    selectUserFollowerByUserIdx,
    selectUserMessageByUserIdx,
    updateUserStatus,
    selectPostList,
    selectPostByPostIdx,
    selectPostImgByPostIdx,
    selectPostLikeByPostIdx,
    selectPostReportByPostIdx,
    selectPostCommentByPostIdx,
    updatePostStatus,
    updateCommentStatus
}