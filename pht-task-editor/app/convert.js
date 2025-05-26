const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'data', 'test.txt');
const outputPath = path.join(__dirname, '..', 'data', 'structured-output.json');

// Load previous data if exists
let previousTasks = [];
if (fs.existsSync(outputPath)) {
    const raw = fs.readFileSync(outputPath, 'utf8');
    previousTasks = JSON.parse(raw);
}

const input = fs.readFileSync(inputPath, 'utf8');
const lines = input.split(/\r?\n/);

const result = [];
let currentDate = null;
let currentTasks = [];
let currentCategory = '';

// Tag inference (simple keyword matching)
function inferTag(text, done) {
    const lower = text.toLowerCase();
    if (!done) return 'future';
    if (lower.includes('fix') || lower.includes('bug')) return 'fix';
    if (lower.includes('new') || lower.includes('added')) return 'new';
    if (lower.includes('improve') || lower.includes('better')) return 'improvement';
    if (lower.includes('update') || lower.includes('updated')) return 'update';
    return 'update';
}

// Detect date format like 25/04 or 25/04/24
function isDate(line) {
    return /^\d{2}\/\d{2}(\/\d{2})?$/.test(line.trim());
}

// Parse each line
for (const lineRaw of lines) {
    const line = lineRaw.trim();

    if (isDate(line)) {
        if (currentDate && currentTasks.length > 0) {
            result.push({ date: currentDate, tasks: currentTasks });
        }
        currentDate = line;
        currentTasks = [];
        currentCategory = '';
    } else if (line.startsWith('- [')) {
        const done = line.startsWith('- [x]');
        let text = line.slice(6).trim();

        const idMatch = text.match(/\{(\d+)\}$/);
        const extractedId = idMatch ? parseInt(idMatch[1], 10) : null;
        if (extractedId) {
            text = text.replace(/\{(\d+)\}$/, '').trim();
        }

        const tag = inferTag(text, done);
        const [title, ...descParts] = text.split(/[:–—]/);
        const description = descParts.join(':').trim();

        currentTasks.push({
            id: extractedId,
            done,
            tag,
            title: title.trim(),
            description: description || '',
            category: currentCategory
        });
    } else if (line && !line.startsWith('-')) {
        currentCategory = line.trim();
    } else if (line && currentTasks.length > 0) {
        currentTasks[currentTasks.length - 1].description += ' ' + line;
    }
}

// Push last block
if (currentDate && currentTasks.length > 0) {
    result.push({ date: currentDate, tasks: currentTasks });
}

// Flatten and sort all tasks
const allTasks = result.flatMap(group => {
    let [y, m, d] = group.date.split('/');
    if (y.length === 2) {
        y = '20' + y; // Expand short year
    }

    const isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    const dateObj = new Date(isoDate);

    return group.tasks.map(task => ({
        ...task,
        date: isoDate,
        _dateObj: dateObj
    }));
});

// Sort for ID assignment (oldest to newest)
allTasks.sort((a, b) => a._dateObj - b._dateObj);

// Determine starting ID from previous tasks
let lastId = previousTasks.reduce((max, t) => Math.max(max, t.id || 0), 0);
const assignedIds = new Map();

const updatedTasks = allTasks.map(newTask => {
    let match;

    if (newTask.id) {
        match = previousTasks.find(prev => prev.id === newTask.id);
    }

    if (!match) {
        match = previousTasks.find(prev =>
            prev.title === newTask.title &&
            prev.date === newTask.date &&
            prev.category === newTask.category
        );
    }

    if (match) {
        // Only update 'done' field, preserve everything else
        return {
            ...match,
            done: newTask.done
        };
    } else {
        const key = `${newTask.title}__${newTask.date}__${newTask.category}`;
        if (!assignedIds.has(key)) {
            lastId += 1;
            assignedIds.set(key, lastId);
            console.log(`🆕 New: ID ${lastId} - ${newTask.title}`);
        }
        newTask.id = assignedIds.get(key);
        newTask.locked = false;
        return newTask;
    }
});

// Clean up temporary fields
allTasks.forEach(task => delete task._dateObj);

// Write result
fs.writeFileSync(outputPath, JSON.stringify(updatedTasks, null, 2), 'utf8');
console.log('✅ structured-output.json created with proper dates and order');