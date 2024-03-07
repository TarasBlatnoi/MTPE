const {wrongPatterns} = require('./wrongPatternsRegExpr')
const {conversions} = require('./conversionsRegExpr')

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

module.exports = {markdownToHTML}