// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;
const upload = multer({ dest: 'uploads/' });

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const TEST_FILE = path.join(DATA_DIR, 'test.txt');
const JSON_FILE = path.join(__dirname, '..', 'data', 'structured-output.json');
const CHANGELOG_FILE = path.join(__dirname, '..', 'data', 'changelog.json');

app.use(express.static(path.join(__dirname, '..', 'public')));

// Upload endpoint
app.post('/upload-test', upload.single('file'), (req, res) => {
    const uploadedPath = req.file.path;

    // Backup current test.txt and JSON if exist
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = path.join(BACKUP_DIR, timestamp);
    if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath, { recursive: true });
    if (fs.existsSync(TEST_FILE)) fs.copyFileSync(TEST_FILE, path.join(backupPath, 'test.txt'));
    if (fs.existsSync(JSON_FILE)) fs.copyFileSync(JSON_FILE, path.join(backupPath, 'structured-output.json'));

    // Replace test.txt
    fs.renameSync(uploadedPath, TEST_FILE);

    try {
        // Run conversion
        execSync('node convert.js');
        res.send({ status: 'success', message: 'test.txt uploaded and converted. Backup created.' });
    } catch (e) {
        res.status(500).send({ status: 'error', message: 'Conversion failed', error: e.message });
    }
});

// Serve the current structured-output.json
app.get('/load-data', (req, res) => {
    try {
        const json = fs.readFileSync(JSON_FILE, 'utf8');
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) {
            console.warn('⚠️ structured-output.json is not an array. Resetting to empty array.');
            return res.json([]);
        }
        res.json(parsed);
    } catch (e) {
        console.error('❌ Error loading structured-output.json:', e.message);
        res.status(500).json({ error: 'Failed to load data', details: e.message });
    }
});

// Accept new data and overwrite structured-output.json and changelog.json
app.post('/save-data', express.json(), (req, res) => {
    console.log('🔄 Incoming save-data payload:', JSON.stringify(req.body, null, 2));
    try {
        if (Array.isArray(req.body.tasks)) {
            fs.writeFileSync(JSON_FILE, JSON.stringify(req.body.tasks, null, 2), 'utf8');
        }
        if (Array.isArray(req.body.changelog)) {
            fs.writeFileSync(CHANGELOG_FILE, JSON.stringify(req.body.changelog, null, 2), 'utf8');
        }
        res.json({ status: 'success', message: 'Data saved successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to save data', details: e.message });
    }
});

// Serve the current changelog.json
app.get('/load-changelog', (req, res) => {
    try {
        const json = fs.readFileSync(CHANGELOG_FILE, 'utf8');
        res.json(JSON.parse(json));
    } catch (e) {
        res.status(500).json({ error: 'Failed to load changelog', details: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Task Editor running at http://localhost:${PORT}`);
});