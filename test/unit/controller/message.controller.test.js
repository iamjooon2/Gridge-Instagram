const MessageController = require('../../../src/controller/message.controller');

this.MessageController = new MessageController();

describe("Message Controller Create", () => {
    test("should have postMessage function", () => {
        expect(typeof this.MessageController.postMessage).toBe("function")
    })
    test("should have getMessage function", () => {
        expect(typeof this.MessageController.getMessages).toBe("function")
    })
});