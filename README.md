# GridgeTestChallenge  
#### 07.25 ~ 8.5 컴공선배팀 그릿지테스트


## Package Structure
```
📂 git@iamjooon2/GridgeTestChallenge
  ┣📂 src
    ┣📂 assets/servicedb # 도커를 이용하여 데이터베이스 띄우는 디렉토리
    ┣📂 controllers # req-검사-service && service-검사-res, Controller Layer
    ┣📂 middlewares # 미들웨어들을 짱박아둔 디렉토리
    ┣📂 models # DB와 직접적으로 만나는 디렉토리, DataManager Layer
    ┣📂 routers # 메서드 종류와 요청에 따른 분기를 다루는 곳
    ┣📂 services # DB와 controller 사이를 중개한다, Service Layer
    ┣📂 utilities # response 관련 함수와 status들을 모아둔 곳
    ┣📜 index.js 
  ┣📂 swagger
  ┣ .env.example 
  ┣ docker-compose.yml
  ┣ package.json

해당 디렉토리 구조는 개발 가이드라인에 맞추어 설계하였습니다
```

## 개발 가이드라인

<a href=https://docs.google.com/spreadsheets/d/1kT9L-gJ9OjGQW34qrG5pVGpXoVafVRx-hFxxDgwXydc/edit?usp=sharing/>스프레드시트 바로가기</a>


## 설계 요구사항 

<a href=https://xd.adobe.com/view/5554835b-8966-41c8-888d-b648719e6485-0007/>링크 바로가기</a>


## Swagger 최소 요구사항 

<a href=https://drive.google.com/file/d/1C4FgBwsbpUhJ1RyDxxMfFKYLO6zeC6UN/view/>링크 바로가기</a>


## DB Scheme

<a href=https://drive.google.com/file/d/1m9-lQGWDdEt3wz-udrPF9fyOt-K1cMzb/view?usp=sharing/>사진 링크 바로가기</a>
<a href=https://aquerytool.com/aquerymain/index/?rurl=18d4ee95-74d5-4465-8983-7df2e9b1799f/>DB설계 사이트 바로가기(비밀번호 : n4i5c2)</a>

## 특이사항
```
채팅도 디비로 구현하라는듯쓰... 웹소켓 써보나 했는데 까비깝숑
```

### 허접 이준희의 고민점
- 어드민 페이지 구현은 어떻게 해야하는가?
  회원 CRUD, 게시글 CRUD, 댓글 CRUD,신고 CRUD 각각의 로그를 볼수 있어야 한다는데..
=> 각각 로그 테이블 따로 생성함
- 회원 조회하기
  조건별 중복조회(이름이 이준희이면서 회원가입 날짜가 22년 7월 25일인 경우) 쿼리 허접이라 조금 쫄림쓰
- Swagger 적용하기
  고민까지는 아니고... 처음 적용하는거라 애좀 먹을 것 같습니다