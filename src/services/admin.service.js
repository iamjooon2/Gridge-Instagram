const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');
const baseResponse = require('../utilities/baseResponseStatus')
const { errResponse, response } = require('../utilities/response');

class AdminService {
    serviceDB
    AdminModel

    constructor(serviceDB, AdminModel) {
        this.serviceDB = serviceDB;
        this.AdminModel = AdminModel;
    }

    // 사용자 목록 조회
    retrieveUserList = async (id, name, signUpDate, status, page) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            const offset = (page-1)*10;

            await connection.beginTransaction();
            
            let whereQuery='';
            if (name !== undefined) {
                whereQuery += ` AND name = ${name}`;
            }
            if (id !== undefined) {
                whereQuery += ` AND ID = ${id}`;
            }
            if (status !== undefined) {
                whereQuery += ` AND status = ${status}`;
            }
            if (signUpDate !== undefined) {
                let date = signUpDate.replace(/(\d{4})(\d{2})(\d{2})/,`'$1-$2-$3'`)
                whereQuery += ` AND DATE(createdAt) = DATE(${date})`;
            }
    
            const adminSelectResult = await AdminModel.selectUserList(connection, whereQuery, offset);
    
            // 로그 디비 넣기
            for (i=0; i<adminSelectResult.length; i+=1){
                await userModel.insertUserLog(connection, adminSelectResult[i].userIdx, 6);
            }
    
            await connection.commit();
            
            return response(baseResponse.SUCCESS, adminSelectResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();
    
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 사용자 상세 정보 조회
    retrieveUserDetailList = async (userIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const userLastLoginTime = await adminModel.selectUserLastLoginTime(connection, userIdx);
            const userPosts = await adminModel.selectUserPostByUserIdx(connection, userIdx);
            const userPostImg = await adminModel.selectUserProfileImgByUserIdx(connection, userIdx);
            const userPostLikes = await adminModel.selectUserPostLikeByUserIdx(connection, userIdx);
            const userPostReports = await adminModel.selectUserPostReportByUserIdx(connection, userIdx);
            const userComments = await adminModel.selectUserCommentByUserIdx(connection, userIdx);
            const userCommentLikes = await adminModel.selectUserCommentLikeByUserIdx(connection, userIdx);
            const userCommentRepoerts = await adminModel.selectUserCommentReportByUserIdx(connection, userIdx);
            const userFollowingMembers = await adminModel.selectUserFollowingByUserIdx(connection, userIdx);
            const userFollowerMembers = await adminModel.selectUserFollowerByUserIdx(connection, userIdx);
            const userMessages = await adminModel.selectUserMessageByUserIdx(connection, userIdx);
    
            await userModel.insertUserLog(connection, userIdx, 6);
    
            await connection.commit();
            
            return response(baseResponse.SUCCESS, 
                [ {'마지막 로그인 시간': userLastLoginTime[0]} ,
                { '작성 게시글': userPosts },
                { '작성 게시글 사진': userPostImg },
                { '좋아요 누른 게시글': userPostLikes },
                { '신고한 게시글': userPostReports },
                { '작성 댓글': userComments },
                { '좋아요 누른 댓글': userCommentLikes },
                { '신고한 댓글': userCommentRepoerts },
                { '이 사용자가 팔로잉하는 사용자': userFollowingMembers },
                { '이 사용자를 팔로잉하는 사용자': userFollowerMembers },
                { '보낸 메시지': userMessages }]
            );
    
        } catch (e) {
            console.log(e);
            await connection.rollback();
    
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }


    // 관리자 권한으로 사용자 정지
    sudoBanUser = async (userIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            const adminSelectResult = await adminModel.updateUserStatus(connection, userIdx);
            await userModel.insertUserLog(connection, userIdx, 5);
            
            await connection.commit();

            return response(baseResponse.SUCCESS, adminSelectResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글 목록 조회
    retrievePostList = async (id, postDate, status, page) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const offset = (page-1)*10;
            
            let whereQuery='';
            if (id !== undefined) {
                whereQuery += ` AND ID = ${id}`;
            }
            if (status !== undefined) {
                whereQuery = ` AND status = ${status}`
            }
            if (postDate !== undefined) {
                let date = postDate.replace(/(\d{4})(\d{2})(\d{2})/,`'$1-$2-$3'`)
                whereQuery += ` AND DATE(createdAt) = DATE(${date})`
            }

            const adminSelectResult = await adminModel.selectPostList(connection, whereQuery, offset);

            // 로그 집어넣기
            for (i =0; i<adminSelectResult.length; i+=1){
                await postModel.insertPostLog(connection, adminSelectResult[i].postIdx, 5);
            }

            await connection.commit();
            
            return response(baseResponse.SUCCESS, adminSelectResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글 세부 내용 조회
    exportsretrievePostDetailList = async (postIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const postResult = await adminModel.selectPostByPostIdx(connection, postIdx);
            const postImgResult = await adminModel.selectPostImgByPostIdx(connection, postIdx);
            const postLikeResult = await adminModel.selectPostLikeByPostIdx(connection, postIdx);
            const postReportResult = await adminModel.selectPostReportByPostIdx(connection, postIdx);
            const postCommentResult = await adminModel.selectPostCommentByPostIdx(connection, postIdx);

            await postModel.insertPostLog(connection, postIdx, 5);

            await connection.commit();
            return response(baseResponse.SUCCESS, 
                [ {'게시글 정보': postResult } ,
                { '게시글 사진': postImgResult },
                { '게시글 좋아요 수': postLikeResult[0] },
                { '게시글 신고 목록': postReportResult },
                { '게시글 댓글 목록': postCommentResult }]);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글, 댓글 강제 삭제
    sudoUpdatePostAndReleatedCommentStatus = async (postIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const postStatusResult = await adminModel.updatePostStatus(connection, postIdx);
            const commentsOfPostResult = await commentModel.selectCommentIdxByPostIdx(connection, postIdx);
            const commentStatusResult = await adminModel.updateCommentStatusByPostIdx(connection, postIdx);

            await postModel.insertPostLog(connection, postIdx, 4);
            for (i = 0; i<commentsOfPostResult.length; i+=1){
                await commentModel.insertCommetLog(connection, commentsOfPostResult[i].commentIdx, 4);
            }
            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글 강제 삭제
    sudoUpdateCommentStatus = async (postIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            
            await adminModel.updatePostStatus(connection, postIdx);

            await postModel.insertPostLog(connection, postIdx, 4);

            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 댓글 강제 삭제
    sudoUpdateCommentStatus = async (commentIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            await adminModel.updateCommentStatusByCommentIdx(connection, commentIdx);
            await commentModel.insertCommetLog(connection, commentIdx, 4);

            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 모든 신고 내역 조회
    retrieveReportList = async () => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const postReportResult = await adminModel.selectPostReports(connection);
            const commentReportResult = await adminModel.selectCommentReports(connection);

            for (i = 0; i<postReportResult.length; i+=1){
                await postModel.insertReportLog(connection, 7, postReportResult[i].postReportIdx,1, 5);
            }
        
            for (i = 0; i<commentReportResult.length; i+=1){
                await commentModel.insertReportLog(connection, commentReportResult[i].connectionReportIdx, 1,  0, 5);  
            }

            await conneciton.commit();
            return response(baseResponse.SUCCESS,
            { "댓글 신고 목록" : postReportResult, 
            "게시글 신고 목록" : commentReportResult},
            );
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 신고 게시글 내용 조회
    retrieveReportPostContent = async (postIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const postReportResult = await adminModel.selectReportPostContent(connection, postIdx);

            await postModel.insertPostLog(connection, postIdx, 4);
            
            await connection.commit();

            return response(baseResponse.SUCCESS, postReportResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 신고 댓글 내용 조회
    retrieveReportCommentContent = async (commentIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const commentReportResult = await adminModel.selectReportCommentContent(connection, commentIdx);

            await commentModel.insertCommetLog(connection, commentIdx, 4);

            await connection.commit();

            return response(baseResponse.SUCCESS, commentReportResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글 신고 사유 조회
    retrieveReportPostReportCode = async (postIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const postReportResult = await adminModel.selectReportPostReportCode(connection, postIdx);

            await postModel.insertReportLog(connection,7, postReportResult[0].postReportIdx, 1, 5);

            await connection.commit();

            return response(baseResponse.SUCCESS, postReportResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 댓글 신고 사유 조회
    retrieveReportCommentReportCode = async (commentIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const commentReportResult = await adminModel.selectReportCommentReportCode(connection, commentIdx);

            await commentModel.insertReportLog(connection, commentReportResult[0].commentReportIdx, 1, 0, 5);

            await connection.commit();

            return response(baseResponse.SUCCESS, commentReportResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글 신고 강제 삭제
    sudoUpdatePostReportStatus = async (postReportIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const postReportResult = await adminModel.updatePostReportStatus(connection, postReportIdx);

            await postModel.insertReportLog(connection, 7, postReportIdx, 0, 4);

            await connection.commit();
            return response(baseResponse.SUCCESS, postReportResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 댓글 신고 강제 삭제
    sudoUpdateCommentReportStatus = async (commentReportIdx) => {
        const connection = await this.serviceDB.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            const commentReportResult = await adminModel.updateCommentReportStatus(connection, commentReportIdx);

            await commentModel.insertReportLog(connection, commentReportIdx, 1,  1, 4);

            await connection.commit();

            return response(baseResponse.SUCCESS, commentReportResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 사용자 관련 로그 조회
    retrieveUserLogs = async (page) => {
        const connection = await this.serviceDB.getConnection(async(connection)=> connection);
        try {
            await connection.beginTransaction();

            const offset = (page-1)*10;
            const logResults = await adminModel.selectUserLogs(connection, offset);

            await connection.commit();
            
            return response(baseResponse.SUCCESS, logResults);
        } catch (e){
            console.log(e)
            await conneciton.rollback();

            return errResponse(baseResponse.DB_ERROR)
        } finally {
            connection.release();
        }
    }

    // 게시글 관련 로그 조회
    retrievePostLogs = async (page) => {
        const connection = await this.serviceDB.getConnection(async(connection)=> connection);
        try {
            await connection.beginTransaction();

            const offset = (page-1)*10;
            const logResults = await adminModel.selectPostLogs(connection, offset);

            await connection.commit();

            return response(baseResponse.SUCCESS, logResults);
        } catch (e){
            console.log(e);
            await connection.rollback;

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 댓글 관련 로그 조회
    retrieveCommentLogs = async (page) => {
        const connection = await this.serviceDB.getConnection(async(connection)=> connection);
        try {
            await connection.beginTransaction();

            const offset = (page-1)*10;
            const logResults = await adminModel.selectCommentLogs(connection, offset);

            await connection.commit();

            return response(baseResponse.SUCCESS, logResults);
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 신고 관련 로그 조회
    retrieveReportLogs = async (page) => {
        const connection = await this.serviceDB.getConnection(async(connection)=> connection);
        try {
            await connection.beginTransaction();

            const offset = (page-1)*10;
            const logResults = await adminModel.selectReportLogs(connection, offset);

            await connection.commit();

            return response(baseResponse.SUCCESS, logResults);
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR)
        } finally {
            connection.release();
        }
    }
    
}

module.exports = AdminService;