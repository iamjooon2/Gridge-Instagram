# GridgeTestChallenge  
```
07.25 ~ 8.5 컴공선배팀 그릿지테스트
```

## Package Structure
```
📂 git@iamjooon2/GridgeTestChallenge
  ┣📂 src
    ┣📂 adapters # 도커를 이용하여 데이터베이스 띄우는 디렉토리
    ┣📂 controllers # req 통해 들어온 검사하여 Service Layer로 넘긴다, Controller Layer
    ┣📂 middlewares # 미들웨어들을 짱박아둔 디렉토리
    ┣📂 models # DB와 직접적으로 만나는 디렉토리, DataManager Layer
    ┣📂 routers/v1 # 메서드 종류와 요청에 따른 분기를 다루는 곳
    ┣📂 services # DB와 controller 사이를 중개해주는 곳, Service Layer
    ┣📂 utilities # response 관련 함수와 status들을 모아둔 곳
    ┣📜 index.js 
  ┣📂 swagger
  ┣ .env.example 
  ┣ docker-compose.yml
  ┣ package.json

해당 디렉토리 구조는 개발 가이드라인에 맞추어 설계하였습니다
```

## 개발 가이드라인
```
https://docs.google.com/spreadsheets/d/1kT9L-gJ9OjGQW34qrG5pVGpXoVafVRx-hFxxDgwXydc/edit?usp=sharing
```

## 설계 요구사항 
```
https://xd.adobe.com/view/5554835b-8966-41c8-888d-b648719e6485-0007/
```

## Swagger 최소 요구사항 
```
https://drive.google.com/file/d/1C4FgBwsbpUhJ1RyDxxMfFKYLO6zeC6UN/view
```

## DB Scheme
https://drive.google.com/file/d/1csx08T4W8gr90uM-hc6oiXaN8FM6eVOa/view?usp=sharing


## 특이사항
채팅도 디비로 구현하라는듯쓰... 웹소켓 써보나 했는데 까비깝숑

