const fs = require('fs');
const path = require('path');

// Read the main content file
const contentPath = path.join(__dirname, '../content/ElectroSage_Academy_Content.md');
const content = fs.readFileSync(contentPath, 'utf-8');

// Create sections directory
const sectionsDir = path.join(__dirname, '../content/sections');
if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
}

// Extract introduction
const introMatch = content.match(/^# Electrical Engineering\s*\n\n## Introduction\s*\n([\s\S]*?)(?=\n## Section 1:)/);
if (introMatch) {
  const introContent = `# Introduction to Electrical Engineering\n\n${introMatch[1].trim()}`;
  fs.writeFileSync(path.join(sectionsDir, '00-introduction.md'), introContent);
  console.log('✓ Created 00-introduction.md');
}

// Split sections using a more robust approach
const sections = content.split(/(?=^## Section \d+:)/gm).filter(section => section.trim().startsWith('## Section'));

sections.forEach((sectionContent, index) => {
  const sectionMatch = sectionContent.match(/^## Section (\d+): (.+)/);
  if (sectionMatch) {
    const sectionNumber = sectionMatch[1].padStart(2, '0');
    const sectionTitle = sectionMatch[2].trim();
    
    // Clean up the content
    const cleanContent = sectionContent.trim();
    
    // Create filename
    const filename = `${sectionNumber}-${sectionTitle.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')}.md`;
    
    const filePath = path.join(sectionsDir, filename);
    fs.writeFileSync(filePath, cleanContent);
    console.log(`✓ Created ${filename}`);
  }
});

console.log('\n✅ Content splitting completed!');
console.log(`📁 All sections saved to: ${sectionsDir}`);
