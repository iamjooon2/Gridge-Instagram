const MessageRepository = require('../../../src/repository/message.repository');

this.MessageRepository = new MessageRepository();

describe("Message Repository Create", () => {
    test("should have insertMessage function", () => {
        expect(typeof this.MessageRepository.insertMessage).toBe("function")
    })
    test("should have selectMessages function", () => {
        expect(typeof this.MessageRepository.selectMessages).toBe("function")
    })
});
