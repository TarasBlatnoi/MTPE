const { checkMdPath } = require("./checkMdPath");

test("Check md path", () => {
  expect(checkMdPath("./markdown.md").toBe("./markdown.md"));
});
