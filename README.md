⸻


# 📝 PHT Task Editor & Updates Generator

A local toolchain for managing, editing, and publishing structured changelogs from simple `test.txt` files to a styled HTML updates page (`updates.html`). Includes a visual editor, JSON converter, and static site generator.

---

## 📁 Project Structure

.
├── app/
│   ├── convert.js             # Converts test.txt → structured-output.json
│   ├── server.js              # Runs local editor server
├── data/
│   ├── test.txt               # Raw task entries
│   ├── structured-output.json # Parsed + cleaned tasks
│   ├── changelog.json         # Change history log
│   ├── generate-timeline.js   # Generates updates.html from JSON
├── public/
│   ├── index.html             # Editor UI
│   ├── updates.html           # Public-facing updates page
│   ├── editor.js              # Main frontend logic
│   └── style.css              # Core styles

---

## 🚀 Getting Started

### 1. **Install dependencies**
```bash
npm install

2. Run local editor

node app/server.js

Then open your browser at:
📍 http://localhost:3000

⸻

🔄 Workflow Overview

✅ Step 1: Add raw tasks

Place your test.txt in /data/.

Example format:

25/04 – update – New sidebar toggle added
26/04 – fix – Incorrect lab data display


⸻

✅ Step 2: Convert test.txt to structured JSON

node app/convert.js

Creates or updates:
	•	structured-output.json (main data)
	•	changelog.json (tracked edits)

⸻

✅ Step 3: Edit via visual UI

Visit:

http://localhost:3000

Make edits:
	•	Task titles, dates, categories
	•	Tags: new, fix, update, etc.
	•	Mark done / lock fields

Click 💾 Save to update structured-output.json.

⸻

✅ Step 4: Generate static HTML

node data/generate-timeline.js

Creates:

/public/updates.html

A clean timeline page styled for web publishing.

⸻

✅ Step 5: Deploy (e.g. GitHub Pages)

Commit and push:

git add .
git commit -m "Update changelog"
git push

Make sure your repo is configured to serve from public/ (or copy to docs/).

⸻

⚙ Configuration

You can change limits, themes, and styles in:
	•	app/server.js – payload size, routes
	•	public/editor.js – editor logic
	•	assets/styles/ – custom themes

⸻

📌 Features
	•	Convert raw text to structured task data
	•	Automatic ID generation by date
	•	Visual task editor with metadata
	•	Locked field protection
	•	Changelog history per field
	•	Responsive HTML updates page
	•	JSON API endpoints for saving/loading

⸻

💡 Roadmap Ideas
	•	GitHub Action to auto-regenerate updates.html on commit
	•	Tag-based filtering in updates.html
	•	CSV import/export
	•	Inline preview for rich formatting

⸻

🛠 Built With
	•	Node.js + Express
	•	Plain HTML/CSS/JS
	•	Vanilla JS DOM editing
	•	No frameworks, no databases

⸻

🧑‍💻 Author

Built with ☕️ 🍺 and 🤖 by Pocebutas

⸻