const fs = require('fs');
const path = require('path');

const updatesPath = path.join(__dirname, '../../updates.html');
const timelinePath = path.join(__dirname, '../../data/timeline.html');

// Load updates.html
let updatesHtml = fs.readFileSync(updatesPath, 'utf-8');
// Load timeline.html
let timelineContent = fs.readFileSync(timelinePath, 'utf8');

// Strip outer <div class="timeline"> wrapper if present
timelineContent = timelineContent
    .replace(/<div[^>]*class=["']timeline["'][^>]*>/i, '')
    .replace(/<\/div>\s*$/, '')
    .trim();

// Inject cleaned timeline content into placeholder
updatesHtml = updatesHtml.replace(
    /(<div[^>]*id=["']timeline-placeholder["'][^>]*>)([\s\S]*?)(<\/div>)/i,
    (match, openTag, oldContent, closeTag) => `${openTag}\n${timelineContent}\n${closeTag}`
);

// Save modified updates.html
fs.writeFileSync(updatesPath, updatesHtml, 'utf-8');
console.log('✅ Injected cleaned timeline.html into updates.html');