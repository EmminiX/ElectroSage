const fs = require('fs');

// Read the content file
const content = fs.readFileSync('./content/Basic_Electricity_Tutor_Content.md', 'utf-8');
// Test the correct regex pattern
const sectionRegex = /^## Section (\d+): ([^\n]+)\n\n([\s\S]*?)(?=\n## Section \d+:|$)/gm;
let match;
let matchCount = 0;

console.log('Testing working section regex...\n');

while ((match = sectionRegex.exec(content)) !== null) {
  matchCount++;
  const sectionNumber = match[1];
  const sectionTitle = match[2].trim();
  const sectionContent = match[3].trim();
  
  console.log(`Match ${matchCount}:`);
  console.log(`Section Number: ${sectionNumber}`);
  console.log(`Section Title: ${sectionTitle}`);
  console.log(`Content Length: ${sectionContent.length} characters`);
  console.log(`Content Preview: ${sectionContent.substring(0, 200)}...`);
  console.log('---\n');
}

console.log(`Total matches found: ${matchCount}\n`);

// Also test the introduction regex
const introMatch = content.match(/^## Introduction[\s\S]*?(?=^## Section \d+:|$)/m);
if (introMatch) {
  console.log('\nIntroduction found:');
  console.log(`Length: ${introMatch[0].length} characters`);
  console.log(`Preview: ${introMatch[0].substring(0, 200)}...`);
} else {
  console.log('\nIntroduction not found');
}
