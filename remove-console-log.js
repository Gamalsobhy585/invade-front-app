import fs from "fs";
import path from "path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide a file path.");
  process.exit(1);
}

const fileContent = fs.readFileSync(filePath, "utf8");

// Remove console.log and console.error statements
let updatedContent = fileContent.replace(/^\s*(console\.log|console\.error)\(.*?\);?\s*$/gm, "");

// Remove single-line comments (// ...)
updatedContent = updatedContent.replace(/\/\/.*$/gm, "");

// Remove multi-line comments (/* ... */)
updatedContent = updatedContent.replace(/\/\*[\s\S]*?\*\//gm, "");

// Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent, "utf8");

console.log(
  `All console.log, console.error statements, and comments have been removed from ${path.basename(filePath)}`
);
