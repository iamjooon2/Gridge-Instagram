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

const getUserIdxByPhone = async (conn, userIdx) => {
    const getUserPhoneQuery = `
        SELECT userIdx
        FROM user
        WHERE phone = ?
    `;

    const [userRow] = await conn.query(getUserPhoneQuery, userIdx);

    return userRow;
}

const updatePassword = async (conn, userParams) => {
    const updatePasswordQuery = `
        UPDATE user
        SET password = ?
        WHERE userIdx = ?    
    `;
    const [userRow] = await conn.query(updatePasswordQuery, userParams);

    return userRow;
}

const updateUserProfile = async (conn, profileImgUrl, name, id, website, introduce, userIdx) => {
    const updateUserProfileQuery = `
        UPDATE user
        SET profileImgUrl = ?, name = ?, id = ?, website = ?, introduce = ?
        WHERE userIdx = ?
    `;

    const [updateUserRow] = await conn.query(updateUserProfileQuery, [profileImgUrl, name, id, website, introduce, userIdx]);

    return updateUserRow;
}

const updateNameAndId = async (conn, name, id, userIdx) => {
    const updateNameAndIdQuery = `
        UPDATE user
        SET name = ? and id = ?
        where userIdx = ?
    `;
    const [updatedUserRow] = await conn.query(updateNameAndIdQuery, [name, id, userIdx]);

    return updatedUserRow;
}

const updatePrivate = async (conn, userIdx, privateCode) => {
    const updatePrivateQuery = `
        UPDATE user
        SET private = ?
        where userIdx = ?
    `;
    const [updatedUserRow] = await conn.query(updatePrivateQuery, [privateCode, userIdx]);

    return updatedUserRow;
}

const checkUserPrivate = async (conn, userId) => {
    const checkUserPrivateQuery = `
        SELECT EXISTS (
            SELECT userIdx
            FROM user
            where ID = ? and private = 1
        ) as success
    `;
    const [checkedRow] = await conn.query(checkUserPrivateQuery, userId);
    
    return checkedRow;
}

const insertFollow = async (conn, userIdx, followUserId, status) => {
    const checkUserPrivateQuery = `
        INSERT INTO following(userIdx, targetUserIdx, status)
        VALUES(?,
                (
                    SELECT userIdx
                    FROM user
                    WHERE ID = ?
                )
                , ?)
    `;

    const [checkedRow] = await conn.query(checkUserPrivateQuery, [userIdx, followUserId, status]);
    
    return checkedRow;
}

const checkFollow = async (conn, userIdx, followUserId, status) => {
    const checkFollowQuery = `
        SELECT EXISTS (
            SELECT followingIdx
            FROM following
            WHERE following.userIdx = ? and following.targetUserIdx = 
            (
                SELECT user.userIdx
                FROM user
                WHERE user.ID = ?
            ) and status = ?
        ) as success
    `;
    const [checkedRow] = await conn.query(checkFollowQuery, [userIdx, followUserId, status]);
    
    return checkedRow;
}

const updateFollowStatus = async (conn, userIdx, followUserId, status) => {
    const updateFollowQuery = `
        UPDATE following
        SET status = ?
        WHERE following.userIdx = ? and (
                SELECT user.userIdx
                FROM user
                WHERE user.id = ?
            )
    `;
    const [updatedRow] = await conn.query(updateFollowQuery, [status, userIdx, followUserId]);

    return updatedRow;
}

module.exports = {
    checkUserExistsByUserId,
    checkUserPassword,
    insertUser,
    insertSocialUser,
    getSocialId,
    getUserIdxBySocialId,
    getUserIdxByUserId,
    getUserProfile,
    getUserIdxByPhone,
    updatePassword,
    updateUserProfile,
    updateNameAndId,
    updatePrivate,
    checkUserPrivate,
    insertFollow,
    checkFollow,
    updateFollowStatus
}
