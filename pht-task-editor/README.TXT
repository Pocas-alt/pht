pht-task-editor/
├── app/                         ← All backend logic and conversion
│   ├── convert.js               ← Enhanced conversion logic
│   ├── server.js                ← Express server (routes, API)
│   ├── logic/                   ← (optional) reusable functions
│   │   └── update-merger.js     ← logic to merge new tasks + lock/tag diff
│
├── public/                      ← Frontend (served by Express)
│   ├── index.html               ← Main UI
│   ├── editor.js                ← Handles frontend logic
│   ├── style.css
│
├── data/                        ← Your active working files
│   ├── test.txt                 ← Input for conversion
│   ├── structured-output.json   ← Main editable JSON file
│
├── backups/                     ← Auto-organized by date
│   └── 2025-05-25/
│       ├── test.txt
│       └── structured-output.json
│
├── static/                      ← (optional) pre-bundled JSON exports or changelogs
│   └── exported-2025-05.json
│
├── logs/                        ← (optional) store task import logs or diffs
│   └── task-import.log
│
├── .gitignore
├── package.json
└── README.md