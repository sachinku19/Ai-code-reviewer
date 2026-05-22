export const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "sql",
  "html",
  "css",
  "json"
];

export const starterCode = `function findDuplicates(items) {
  const seen = [];
  const duplicates = [];

  for (let i = 0; i < items.length; i++) {
    if (seen.includes(items[i])) {
      duplicates.push(items[i]);
    } else {
      seen.push(items[i]);
    }
  }

  return duplicates;
}`;
