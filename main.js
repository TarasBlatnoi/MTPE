const fs = require("fs").promises;

const args = process.argv.slice(2);

const path = args[0];
let outputFlag = false;
let outputFile = null;
if (args[1] === "--out" && args[2]) {
  if (args[2].endsWith(".html")) {
    outputFlag = true;
    outputFile = args[2];
  } else {
    console.log("No output flag or bad filename");
  }
} else {
  console.log("No output flag or no file after it");
}

async function checkMdPath(path) {
  if (!path.endsWith(".md")) {
    console.log("Not a Markdown file.");
    return;
  }
  try {
    const stats = await fs.stat(path);

    if (stats.isFile() && stats.size > 0) {
      console.log(
        "File on this path with md extension exists and contains data"
      );
      return path;
    } else {
      console.log("File exists but is empty.");
      return;
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("Wrong path to md file");
    } else {
      console.error("Error reading file:", err);
    }
    return;
  }
}

// Regular expression patterns and their replacements
const conversions = [
  { pattern: /^\s*$/gm, replacement: "<br>" },
  { pattern: /\*\*(.*?)\*\*/g, replacement: "<b>$1</b>" },
  { pattern: /\_(.*?)\_/g, replacement: "<em>$1</em>" },
  { pattern: /```([\s\S]+?)```/g, replacement: "<pre>$1</pre>" }, // Code blocks
];

// Function to convert Markdown to HTML
function markdownToHTML(markdown) {
  conversions.forEach(({ pattern, replacement }) => {
    markdown = markdown.replace(pattern, replacement);
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${markdown}
</body>
</html>`;
}

async function convertToHTML(path) {
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
  if (outputFile && html) {
    await fs.writeFile(outputFile, html);
    console.log("File created and content written successfully.");
  } else {
    console.log(html);
  }
}

convertToHTML(path);
