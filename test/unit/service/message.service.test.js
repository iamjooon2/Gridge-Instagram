const MessageService = require('../../../src/service/message.service');

this.MessageService = new MessageService();

describe("Message Service Create", () => {
    test("should have postMessage function", () => {
        expect(typeof this.MessageService.postMessage).toBe("function")
    })
    test("should have getMessages function", () => {
        expect(typeof this.MessageService.getMessages).toBe("function")
    })
});

