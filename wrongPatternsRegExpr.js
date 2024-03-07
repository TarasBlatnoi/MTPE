const wrongPatterns = [
  {
    pattern: /\*\*.*(\`|\_|(\*\*)).*(\`|\_|(\*\*)).*\*\*/g,
  },
  // change
  {
    pattern: /\_*.*(\`|\_|(\*\*)).*(\`|\_|(\*\*)).*\_/g,
  },
  // change
  {
    pattern: /\`.*(\`|\_|(\*\*)).*(\`|\_|(\*\*)).*\`/g,
  },
  {
    pattern: /(?<=(^| )\*\*)[^**\n]*$/gm,
  },
  {
    pattern: /(?<=(^| )\`)[^`\n]*$/gm,
  },
  {
    pattern: /(?<=(^| )\_)[^_\n]*$/gm,
  },
];
  

module.exports = {wrongPatterns}