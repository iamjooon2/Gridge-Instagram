const checkUserExistsByUserId =  async (conn, userId) => {
    const selectByUserIdQuery = `
        SELECT id
        FROM user
        WHERE ID = ?
    `;
    const [userRow] = await conn.query(selectByUserIdQuery, userId);

    return userRow;
}

const checkUserPassword = async (conn, userId) => {
    const checkUserPasswordQuery = `
        SELECT password
        FROM user
        WHERE ID = ?
    `;
    const [checkRow] = await conn.query(checkUserPasswordQuery, userId);
    
    return checkRow;
}

const insertUser = async (conn, phone, name, hashedPassword, birth, id) => {
    const insertUserQuery = `
        INSERT INTO user(phone, name, password, birth, ID)
        VALUES(?,?,?,?,?)
    ;`;
    const [insertedRow] = await conn.query(insertUserQuery, [phone, name, hashedPassword, birth, id]);

    return insertedRow;
}

const insertSocialUser = async (conn, phone, name, hashedPassword, birth, id, socialId) => {
    const insertUserQuery = `
        INSERT INTO user(phone, name, password, birth, ID, socialId, userType)
        VALUES(?,?,?,?,?,?,?)
    ;`;
    const [insertedRow] = await conn.query(insertUserQuery, [phone, name, hashedPassword, birth, id, socialId, 1]);

    return insertedRow;
}

const getSocialId = async (conn, socialId) => {
    const getSocialIdQuery = `
        SELECT socialId
        FROM user
        WHERE socialId = ?
    `;
    const [userRow] = await conn.query(getSocialIdQuery, socialId);

    return userRow;
}

const getUserIdxBySocialId = async (conn, socialId) => {
    const getUserIdxBySocialIdQuery = `
        SELECT userIdx
        FROM user
        WHERE socialId = ?
    `;
    const [userRow] = await conn.query(getUserIdxBySocialIdQuery, socialId);

    return userRow;
}

const getUserIdxByUserId = async (conn, userId) => {
    const getUserIdxByUserIdQuery = `
        SELECT userIdx
        FROM user
        WHERE ID = ?
    `;
    const [userRow] = await conn.query(getUserIdxByUserIdQuery, userId);

    return userRow;
}

const getUserProfile = async (conn, userIdx) => {
    const selectUserProfileQuery = `
        SELECT id, name, introduce, profileImgUrl, website,
            if (postCount is null, 0, postCount) as postCount,
            if (followerCount is null, 0, followerCount) as followerCount,
            if (followingCount is null, 0, followingCount) as followingCount
        FROM user
            INNER JOIN (
                SELECT userIdx, COUNT(postIdx) as postCount
                FROM post
                WHERE status = 0
                GROUP BY userIdx
                ) post ON user.userIdx = post.userIdx
            INNER JOIN (
                SELECT userIdx, COUNT(followerIdx) as followerCount
                FROM follower
                WHERE status = 0
                GROUP BY userIdx
                ) follower on follower.userIdx = user.userIdx
            INNER JOIN (
                SELECT userIdx, COUNT(followingIdx) as followingCount
                FROM following
                WHERE status = 0
                GROUP BY userIdx
                ) following on following.userIdx = user.userIdx
        WHERE user.userIdx = ?
    `;
    const [userProfileRow] = await conn.query(selectUserProfileQuery, userIdx);

    return userProfileRow;
}

module.exports = {
    checkUserExistsByUserId,
    checkUserPassword,
    insertUser,
    insertSocialUser,
    getSocialId,
    getUserIdxBySocialId,
    getUserIdxByUserId,
    getUserProfile
}
