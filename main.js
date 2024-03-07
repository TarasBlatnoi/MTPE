const fs = require("fs").promises;
const { commandValidation } = require('./commandValidation')
const { checkMdPath } =  require('./cheskMdPath')
const {markdownToHTML} = require('./markdownToHtml');
const args = process.argv.slice(2);

const commandArgs = commandValidation(args)

async function main(path) {
  const mdRightPath = await checkMdPath(path);
  let data;
  if (mdRightPath) {
    data = await fs.readFile(mdRightPath, "utf-8");
  }
  let html;
  if (data) {
    html = markdownToHTML(data);
  } else {
    console.log(`Couldn't read the file`);
  }
  if (commandArgs.outputFile && html) {
    await fs.writeFile(commandArgs.outputFile, html);
    console.log("File created and content written successfully.");
  } else {
    console.log(html);
  }
}

main(commandArgs.path);
