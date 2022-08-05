const selectUserList = async (conn, id, name, signUpDate, status, offset) => {
    const adminSelectUserQuery = `
        SELECT *
        FROM user
        WHERE (ID = ? OR ID is not null) AND (name = ? OR name is not null) AND (createdAt = ? or createdAt is not null) AND (status = ? or status is not null)
        ORDER BY createdAt ASC
        LIMIT 10 OFFSET ?
    `;

    const [userRow] = await conn.query(adminSelectUserQuery, [id, name, signUpDate, status, offset]);

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
    updateUserStatus
}