// TDD를 위한 인터페이스 작성
module.exports = {
    before() {
      // excuted before test suite
    },
    after() {
      // excuted after test suite
    },
    beforeEach() {
      // excuted before every test
    },
    afterEach() {
      // excuted after every test
    },
  
    'exports style': {
      '#example': {
        'this is a test': () => {
          // write test logic
        },
      },
    },
  }
  
