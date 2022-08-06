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
    ┣📂 services # DB와 controller 사이를 중개한다, Service Layer
    ┣📂 utilities # response 관련 status와 함수를 모아둔 곳
    ┣📜 index.js 
  ┣📂 swagger
  ┣ .env.example 
  ┣ docker-compose.yml # AWS 프리티어 안되서.. 도커로 로컬에서 디비 띄우자~
  ┣ package.json 

해당 디렉토리 구조는 개발 가이드라인에 맞추어 설계하였습니다
```

## 개발 가이드라인

<a href=https://docs.google.com/spreadsheets/d/1kT9L-gJ9OjGQW34qrG5pVGpXoVafVRx-hFxxDgwXydc/>스프레드시트</a>


## 설계 요구사항 

<a href=https://xd.adobe.com/view/5554835b-8966-41c8-888d-b648719e6485-0007/>사진 링크</a>


## Swagger 최소 요구사항 

<a href=https://drive.google.com/file/d/1C4FgBwsbpUhJ1RyDxxMfFKYLO6zeC6UN/view/>사진 링크</a>


## DB Scheme

<a href=https://drive.google.com/file/d/1m9-lQGWDdEt3wz-udrPF9fyOt-K1cMzb/>사진 링크 바로가기</a> <br>
https://aquerytool.com/aquerymain/index/?rurl=18d4ee95-74d5-4465-8983-7df2e9b1799f
DB설계 페이지 (비밀번호 : n4i5c2)


# 해야할 것
- 디비 트랜잭션 처리
- 로그 CRUD 보기
- 데이터베이스 ERD 확인 (빠진거 있나)
- swagger 적용
- baseResponseStatus 수정
- ReADME 정리