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
  { pattern: /\_([^ ])\_/g, replacement: " <em>$1</em> " },
  { pattern: /\`([^ ].*[^ ])\`/g, replacement: " <tt>$1</tt> " },
  { pattern: /\`([^ ])\`/g, replacement: " <tt>$1</tt> " },
];

module.exports = {conversions}