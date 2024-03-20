const fs = require("fs").promises;
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

module.exports = { checkMdPath };
