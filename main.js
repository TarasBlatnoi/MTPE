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
  { pattern: /\`\`\`([\s\S]+?)\`\`\`/g, replacement: "<pre>$1</pre>" },
  { pattern: /^\s*$/gm, replacement: "<p></p>" },
  {
    pattern: /\*\*([^ ].*[^ ])\*\*/g,
    replacement: "<b>$1</b>",
  },
  {
    pattern: /\*\*([^ ])\*\*/g,
    replacement: "<b>$1</b>",
  },

  { pattern: /\_([^ ].*[^ ])\_/g, replacement: " <em>$1</em> " },
  { pattern: /\`([^ ].*[^ ])\`/g, replacement: " <tt>$1</tt> " },
];

const wrongPatterns = [
  {
    pattern: /\*\*[*]{2,}.*[*]{2,}\*\*/g,
  },
  {
    pattern: /\*\*[`].*[`]\*\*/g,
  },
  {
    pattern: /\*\*[_].*[_]\*\*/g,
  },
  {
    pattern: /\`\_/g,
  },
];

// Function to convert Markdown to HTML
function markdownToHTML(markdown) {
  const mistakes = wrongPatterns.filter(({ pattern }) =>
    pattern.test(markdown)
  );
  if (mistakes.length > 0) {
    console.log("Wrong file");
    return;
  }
  const regex = /\`\`\`([\s\S]+?)\`\`\`/g;
  const matches = [...markdown.matchAll(regex)];
  for (let match of matches) {
    match[0] = match[0].replace(/\`\`\`([\s\S]+?)\`\`\`/g, "<pre>$1</pre>");
  }
  const paragraphs = markdown.split(/([a-zA-Z0-9]*)^\s*$/gm);
  for (let i = 0; i < paragraphs.length; i++) {
    let element = paragraphs[i];
    if (!element) {
      paragraphs.splice(i, 1);
      i--;
    }
  }
  let htmlParagraphs = paragraphs.map((paragraph) => {
    return `<p>${paragraph.trim()}</p>`;
  });
  htmlParagraphs = htmlParagraphs.join("\n");
  conversions.forEach(({ pattern, replacement }) => {
    htmlParagraphs = htmlParagraphs.replace(pattern, replacement);
  });

  const replacedText = htmlParagraphs.replace(/<pre>[\s\S]*?<\/pre>/g, () => {
    const element = matches.shift();
    return element[0];
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${replacedText}
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
