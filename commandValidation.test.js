const { commandValidation } = require("./commandValidation");

test("validateCommand should return object like { path, outputFile }", () => {
  expect(
    commandValidation(["./markdown.md", "--out", "index.html"])
  ).toStrictEqual({
    path: "./markdown.md",
    outputFile: "index.html",
  });
});
