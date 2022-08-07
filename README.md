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
3. routers/*.router.js - 해당하는 도메인로 requset, response 관리
4. controllers/*.controller.js - 유효성 검사, 인증 등 Controller Layer
5. services/*.service.js - 데이터 전달 혹은 데이터베이스에서 뽑아온 데이터 정제
6. models/*.model.js - 데이터베이스 접근 쿼리들의 집합, DataManager Layer
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

