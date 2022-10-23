## Package Structure
```
📂 git@iamjooon2/GridgeTestChallenge
  ┣📂 src
    ┣📂 asset # 도커를 이용하여 데이터베이스 띄우는 디렉토리 
    ┣📂 controller # req->검사->service && service->검사->res, Controller Layer
    ┣📂 middleware # 미들웨어들을 짱박아둔 디렉토리
    ┣📂 repository # DB 접근하는 디렉토리, DataManager Layer
    ┣📂 router # 메서드 종류와 요청에 따른 분기를 다루는 곳
    ┣📂 service # Controller에서 비즈니스 로직만을 빼낸 곳, Service Layer
    ┣📂 utilitiy # response 관련 status와 함수들, 그 외 유틸관련 모아둔 곳
    ┣📜 app.js 
  ┣📂 swagger
  ┣📂 test
  ┣ .env.example 
  ┣ docker-compose.yml
  ┣ package.json 

```
## API 로직

1. app.js(express) - 익스프레스가 띄운 서버로 접속
2. router/index.js - 도메인별 라우터 분기
3. router/*.router.js - 해당하는 도메인 별 API로 넘김
4. controller/*.controller.js - 유효성 검사, 인증처리 등, Controller Layer
5. service/*.service.js - DB로 데이터 전달 혹은 DB에서 뽑아온 데이터 정제, Controller에서 분리된 비즈니스 로직들, Service Layer
6. repository/*.repository.js - DB 접근 쿼리들의 집합, DataManager Layer
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


## DB Scheme
https://drive.google.com/file/d/12tflQMZaL7TZuIMznBwQQKGe7IpBJMDD/view?usp=sharing


## Swagger
https://app.swaggerhub.com/apis-docs/iamjooon2/GridgeTestChallenge/1.0.0#/
