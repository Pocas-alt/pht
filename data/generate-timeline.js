const fs = require('fs');
const path = require('path');

// Load changelog JSON
const rawData = fs.readFileSync(path.join(__dirname, 'changelog.json'), 'utf-8');
const changelog = JSON.parse(rawData);

// Helper to get "May 2025" from "2025-05"
function getMonthLabel(dateStr) {
    const [year, month] = dateStr.split('-');
    return new Date(`${year}-${month}-01`).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric'
    });
}

// Group by month
const grouped = {};
for (const item of changelog) {
    if (!item.title || !item.description) continue; // Skip entries without title or description
    const month = item.date.slice(0, 7); // e.g. "2025-05"
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(item);
}

// Sort months descending
const sortedMonths = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

let html = `<div class="timeline">\n`;

for (const month of sortedMonths) {
    const monthLabel = getMonthLabel(month);
    html += `  <div class="timeline-month">\n    <h2>${monthLabel}</h2>\n  </div>\n`;

    const entries = grouped[month].sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const item of entries) {
        html += `  <div class="timeline-item">\n`;
        html += `    <div class="timeline-date">${item.date}</div>\n`;
        html += `    <section class="changelog-entry ${item.tag.toLowerCase()}">\n`;
        html += `      <div class="entry-header">\n`;
        html += `        <span class="entry-tag ${item.tag.toLowerCase()}">${item.tag}</span>\n`;
        html += `        <span class="entry-id">#${item.id}</span>\n`;
        html += `      </div>\n`;
        html += `      <h3 class="entry-title">${item.title}</h3>\n`;
        html += `      <p class="entry-description">${item.description}</p>\n`;
        html += `    </section>\n`;
        html += `  </div>\n`;
    }
}

html += `</div>\n`;

// FIX: Write to timeline.html inside data/ instead of overwriting updates.html
fs.writeFileSync(path.join(__dirname, 'timeline.html'), html, 'utf-8');
console.log("✅ Timeline written to data/timeline.html");