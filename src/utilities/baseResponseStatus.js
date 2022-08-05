module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message": "성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message": "JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message": "JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message": "JWT 토큰 검증 성공" },
    ACCESS_TOKEN_EMPTY : { "isSuccess" : false, "code": 3008, "message": "refresh token 만료, 새 AccessToken이 필요합니다."},

    //Request error
    SIGNIN_ERROR : {"isSuccess": false, "code": 1998, "message": "회원가입을 해주세요"},
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_PASSWORD_REGEX : { "isSuccess": false, "code": 2030, "message":"비밀번호는 특수문자를 포함해야 합니다." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SIGNUP_BIRTH_EMPTY : { "isSuccess": false, "code": 2006, "message":"생일을 입력 해주세요." },
    SIGNUP_BIRTH_REGEX : { "isSuccess": false,"code": 2007,"message":"생일을 날짜 형식에 맞게 입력해주세요." },
    TOKEN_WRONG_ACCESS : { "isSuccess": false,"code": 2007,"message": "잘못된 접근입니다." }, // jwt미들웨어 임시

    SIGNIN_USERNAME_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_PASSWORD_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },
    SIGNIN_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNIN_PASSWORD_REGEX : { "isSuccess": false, "code": 2030, "message":"비밀번호는 특수문자를 포함해야 합니다." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },
    USER_USERID_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 아이디를 사용한 회원이 존재합니다." },
    USER_USERID_LENGTH : { "isSuccess": false, "code": 2014, "message": "userId는 최대 20자리를 입력해주세요." },
    USER_USERID_SHORT : { "isSuccess": false, "code": 2014, "message": "userId는 최소 3자리 이상 입력해주세요." },

    USER_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2015, "message": "전화번호를 입력해주세요." },
    USER_PHONENUMBER_LENGTH : { "isSuccess": false, "code": 2015, "message": "전화번호 길이를 확인해주세요." },
    USER_PHONENUMBER_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "전화번호는 숫자만 입력해주세요." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2017, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2018, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_NAME_EMPTY : { "isSuccess": false, "code": 2015, "message": "이름을 입력해주세요." },
    USER_NAME_LENGTH : { "isSuccess": false, "code": 2015, "message": "이름 길이를 확인해주세요." },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2019, "message": "회원 상태값을 입력해주세요" },

    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2020, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_LENGTH : { "isSuccess": false, "code": 2021, "message": "userIdx는 0보다 큰 값으로 입력해주세요." },

    REQUEST_CODE_EMPTY : { "isSuccess": false, "code": 2021, "message": "요청코드를 입력해주세요." },
    REQUEST_CODE_ERROR: { "isSuccess": false, "code": 2021, "message": "요청코드를 정확히 입력해주세요." },

    POST_POSTIMGURLS_EMPTY : { "isSuccess": false, "code": 2022, "message": "postImgUrls를 입력해주세요." },
    POST_CONTENT_LENGTH : { "isSuccess": false, "code": 2023, "message": "content의 길이는 450 이하로 입력해주세요." },
    ADMIN_DATE_REGEX : { "isSuccess": false, "code": 2002, "message": " 날짜 형식이 옳지 않습니다." },

    POST_POSTIDX_EMPTY: { "isSuccess": false, "code": 2024, "message": "postIdx를 입력해주세요." },
    POST_POSTIDX_LENGTH: { "isSuccess": false, "code": 2025, "message": "postIdx는 0보다 큰 값으로 입력해주세요." },
    
    POST_CONTENT_EMPTY : { "isSuccess": false, "code": 2026, "message": "게시글 내용을 입력해주세요." },

    COMMENT_CONTENT_LENGTH : { "isSuccess": false, "code": 2026, "message": "입력 가능한 댓글 길이를 초과했습니다." },
    COMMENT_CONTENT_EMPTY : { "isSuccess": false, "code": 2026, "message": "댓글 내용을 입력해주세요." },
    COMMENT_COMMENTIDX_EMPTY : { "isSuccess": false, "code": 2020, "message": "commentIdx를 입력해주세요." },
    COMMENT_COMMENTIDX_LENGTH : { "isSuccess": false, "code": 2021, "message": "commentIdx는 0보다 큰 값으로 입력해주세요." },
    COMMENT_STATUS_INACTIVE : {"isSuccess": false, "code": 2022, "message": "이미 삭제된 댓글입니다."},

    WRITER_NOT_MATCH : {"isSuccess": false, "code": 2022, "message": "작성자와 사용자가 일치하지 않습니다"},
    MESSAGE_USERIDX_EMPTY : {"isSuccess": false, "code": 2040, "message": "메시지 상대 userIdx가 오지 않았습니다."},
    MESSAGE_USERIDX_LENGTH: {"isSuccess": false, "code": 2041, "message": "메시지 상대 userIdx길이를 확인해주세요"},
    MESSAGE_CONTENT_EMPTY: {"isSuccess": false, "code": 2042, "message": "메시지 내용을 입력해주세요"},
    MESSAGE_CONTENT_LENGTH: {"isSuccess": false, "code": 2043, "message": "메시지 내용은 200자 이하로 입력해주세요."},

    PAGENATION_ERROR : {"isSuccess": false, "code": 2026, "message": "보고싶은 페이지를 입력해주세요. "},
    SIGNIN_PASSWORD_LENGTH : { "isSuccess": false, "code": 2027, "message": "비밀번호의 길이는 6자리 이상으로 입력해주세요." },

    REPORT_CODE_EMPTY : { "isSuccess": false, "code": 2027, "message": "신고 구분이 입력되지 않았습니다" },
    REPORT_ENTERED: { "isSuccess": false, "code": 2027, "message": "이미 신고되었습니다" },
    REPORT_POST_MYSELF : { "isSuccess": false, "code": 2027, "message": "본인이 작성한 게시글입니다" },
    REPORT_COMMENT_MYSELF : { "isSuccess": false, "code": 2027, "message": "본인이 작성한 댓글입니다" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    FOLLOW_SUCCESS : { "isSuccess": false, "code": 3007, "message": "팔로우 성공하였습니다" },
    FOLLOW_REQUEST_SUCCESS : { "isSuccess": false, "code": 3008, "message": "팔로우 요청이 완료되었습니다" },
    FOLLOW_REQUEST_EMPTY : { "isSuccess": false, "code": 3008, "message": "사라진 팔로우 요청입니다" },
    FOLLOW_EXISTS: { "isSuccess": false, "code": 3008, "message": "이미 팔로우중인 사용자입니다." },
    
    UNFOLLOW_SUCCESS : { "isSuccess": false, "code": 3008, "message": "팔로우 취소 성공하였습니다" },
    POST_STATUS_INACTIVE : { "isSuccess": false, "code": 3007, "message": "이미 삭제된 게시물입니다." },
    USER_PRIVATE_ERROR: { "isSuccess": false, "code": 2019, "message": "비공개 설정 사용자가 아닙니다" },
    AUTH_NUMBER_WRONG : { "isSuccess": false, "code": 3008, "message": "인증번호가 잘못되었습니다" },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
}