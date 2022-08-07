# GridgeTestChallenge  
#### 07.25 ~ 8.5 컴공선배팀 그릿지테스트

## Package Structure
```
📂 git@iamjooon2/GridgeTestChallenge
  ┣📂 src
    ┣📂 assets # 도커를 이용하여 데이터베이스 띄우는 디렉토리 
    ┣📂 controllers # req->검사->service && service->검사->res, Controller Layer
    ┣📂 middlewares # 미들웨어들을 짱박아둔 디렉토리
    ┣📂 models # DB와 직접적으로 만나는 디렉토리, DataManager Layer
    ┣📂 routers # 메서드 종류와 요청에 따른 분기를 다루는 곳
    ┣📂 services # DB와 controller 사이를 중개합니다, Service Layer
    ┣📂 utilities # response 관련 status와 함수를 모아둔 곳
    ┣📜 index.js 
  ┣📂 swagger
  ┣ .env.example 
  ┣ docker-compose.yml # AWS 프리티어 안되서.. 도커로 로컬에서 디비 띄우자~
  ┣ package.json 

```
## API 로직

1. index.js(express) - 익스프레스가 띄운 서버로 접속
2. routers/index.js - 도메인별 라우터로 분기
3. routers/*.router.js - 해당하는 도메인로 라우팅
4. controllers/*.controller.js - 유효성 검사, 인증처리 등, Controller Layer
5. services/*.service.js - DB로 데이터 전달 혹은 DB에서 뽑아온 데이터 정제, Service Layer
6. models/*.model.js - DB 접근 쿼리들의 집합, DataManager Layer
7. DataBase


## How To Run
```
0. docker desktop 설치 후 실행
1. GridgeTestChallenge 경로로 이동
2. docker-compose up --build -d  // 도커 빌드
3. npm run db:init // 도커 데이터베이스 생성
4. npm run start // express 실행
5. npm run db:drop // 도커 데이터베이스 날리기...

```

## 엑셀 제출 폼

https://docs.google.com/spreadsheets/d/10zoaoUnO98aZFaBJowZmX0E4__m7tW4_iFoUhOs7Y0A/edit#gid=0/>


## DB Scheme
https://drive.google.com/file/d/12tflQMZaL7TZuIMznBwQQKGe7IpBJMDD/view?usp=sharing


## Swagger
https://app.swaggerhub.com/apis-docs/iamjooon2/GridgeTestChallenge/1.0.0#/

## Review
앱런칭 동아리 프론트맨이 거의 참여를 안해서... 앱 플레이스토어에 올리는건 안될 것 같고.. 디자이너도 바쁘고....
방학동안 집중하며 성장할 게 필요했다
2주 시간 주고 가이드라인대로 뽑아낼 수 있는지, 요구사항을 주고 제작해내라는 챌린지다
다행히도 일단 돌아가게는 만들어냈다

폴더 구조는 요구사항인 MVC 패턴과 내가 여태껏 봐온 노드 템플릿들을 최대한 적절히 섞어서 설계했다
밤낮 바뀐채로 열심히 해봤던 것 같은데 아쉬움이 더 많다

먼저 시간이 없어서 못했던 것은
- 사용자 아이디,이름 변경 횟수 제한 구현(14주내 2회)

따로 횟수 테이블을 만들거나, 유저 테이블에 횟수 카운트하는 칼럼을 필드를 추가하는 방식으로 구현하면 되겠다는 생각을 했으나..
막판에 시간에 쫓겨서 하지 못했다

개인적으로 아쉬운 점은
- 어드민 페이지 사용자 조회
- 사용자 세션 처리(Redis 써보고 싶었음)
- 공개/비공개 계정에 따른 사용자 피드 조회 제한 고려(제출하면서 놓친 것을 확인했다)
- Service Layer에서 데이터를 미처 정제하지 못하고 Controller Layer로 넘어가서 정제한 몇몇 API들
- 게시글 사진 조회 API에서 게시글에 딸린 사진들을 깔끔하게 클라이언트로 보내지 못한 것(쿼리실력 부족)
- swagger 연동

이 있다... 적고보니 많네
그리고 하나하나 이유를 적어보려 한다

1. 어드민 페이지 사용자 조회
SQL Injection 방어를 위해서 prepared statement 사용이 무.적.권인 것을 모르는 것은 아니다
근데.. 저 방법밖에 모르겠다... (+구글링 스킬 부족)
방법 찾아서 블로그에 써놔야지

2. 사용자 세션 처리
AWS EC2 프리티어가 끝나서 도커로 MySQL 띄워서 썼다
우영우보다 도커 사랑하는 용진이형이 이전에 해놓은거 수정해서 썼음. 
용진이형 다시 한 번 감사합니다
근데 도커로 DB 띄울꺼면, Redis도 띄워서 세션처리 하면 되지 않나?
지금 하고있는 프로젝트에 선동해야겠음. Redis 쓰자고..
결과적으로 이 프로젝트에서 세션 처리는
유저 테이블에 토큰 필드를 추가, 로그인할 때마다 클라이언트에서 준 토큰과 디비의 토큰을 비교하는 방식으로 했당
accessToken, refreshToken의 두 개의 토큰이 아닌 하나 들고, 만료기간 끝나면 재 로그인하라는 방식이다.
이번 프로젝트에서 로그인 맡았으니 남은 방학때 착실히 해봐야겠다

3. 공개/비공개 계정에 따른 사용자 피드 조회 제한 고려
사용자 피드 조회 API를 만든 다음, 비공개/공개 계정 설정 API를 만든 것이 화근이었다
설게를 꼼꼼히 하지 않았다는 생각밖에 들지 않음....
이번주내로 고쳐놓을 예정

4. Service Layer에서 데이터를 미처 정제하지 못하고 Controller Layer로 넘어가서 정제한 몇몇 API들
이번주내로 수정할 예정

5. 게시글 사진 조회 API에서 게시글에 딸린 사진들을 깔끔하게 클라이언트로 보내지 못한 것(쿼리실력 부족)
게시글 테이블과 게시글의 사진 테이블이 따로따로 있다
얘네를 정제해서 줄때
```
{
  postIdx : 1,
  postImgUrl : {
    '링크1',
    '링크2',
    '링크3',
  }
},
```
이런식으로 줬어야 했는데

```
{
  postIdx : 1,
  postImgUrl : '링크1'
},
{
  postIdx : 1,
  postImgUrl : '링크2'
}
```
이런식으로 줬다(...)
아무리 생각해도 밑에건 아닌 것 같다. 이건 좀 더 찾아봐야 할 것 같다

7. swagger 연동
처음 써보는 것이고, 링크로 제출하라고 해서 온라인 허브에서 API를 만들었다
다음에 협업할 때는 제대로 연동해보아야겠음


뿌듯한 점도 있다
- 쿼리가 진짜 많이 늘었다
- 자신감(하면 된다)

1. 쿼리가 진짜 많이 늘었다
구현한 쿼리중에 30줄짜리도 있었다...
윤영미 교수님 기다리십쇼... 재수강하러갑니다...
2. 자신감
어떤 분야든 간에, 시간을 쏟으면 안되는 것은 없다는 것을 다시금 느꼈다
졸업프로젝트하면서 느꼈던 감정이다. 하면 된다!

젊어서 고생은 사서 한다고 했다
그리고 지금 내가 하는 공부는 나중에 나에게 다 돌아올 것이다.
남은 방학 좀 더 알차게 보내보자. 이준희 화이팅