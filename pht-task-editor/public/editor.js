// editor.js
let tasks = [];
let changelog = [];
let fileHandle;
let selectedTaskIndex = null;

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach((task, i) => {
    const row = document.createElement('div');
    row.className = 'task-row';
    row.dataset.index = i;

    row.innerHTML = `
  <div class="task-title">${task.id}. ${task.title || '[No title]'}</div>
  <div class="task-meta">
    <span class="task-tag ${task.tag}">${task.tag}</span>
    ${task.category ? `<span class="task-meta-tag">#${task.category}</span>` : ''}
    ${task.done ? `<span class="task-meta-tag done">✓ Done</span>` : ''}
    ${task.locked ? `<span class="task-meta-tag locked">🔒 Locked</span>` : ''}
    <span class="task-meta-tag date">${task.date}</span>
  </div>
`;

    row.addEventListener('click', () => {
      selectedTaskIndex = i;
      renderSelectedTask();
    });

    list.appendChild(row);
  });
}

function recordChange(id, field, from, to) {
  if (from === to) return;
  changelog.push({
    taskId: id,
    field,
    from,
    to,
    timestamp: new Date().toISOString(),
    user: 'You'
  });
}

function renderSelectedTask() {
  const container = document.getElementById('task-detail');
  if (selectedTaskIndex === null || !tasks[selectedTaskIndex]) {
    container.innerHTML = '<p>Select a task to edit.</p>';
    return;
  }

  const task = tasks[selectedTaskIndex];
  container.innerHTML = `
    <div class="field id"><label>ID</label><input value="${task.id}" disabled></div>
    <div class="field date"><label>Date</label><input type="date" value="${task.date}" data-key="date"></div>
    <div class="field title"><label>Title</label><input value="${task.title}" data-key="title" class="field-title"></div>
    <div class="field description"><label>Description</label><textarea data-key="description">${task.description || ''}</textarea></div>
    <div class="field tag"><label>Tag</label>
      <select data-key="tag">
        <option value="update" ${task.tag === 'update' ? 'selected' : ''}>Update</option>
        <option value="new" ${task.tag === 'new' ? 'selected' : ''}>New</option>
        <option value="improvement" ${task.tag === 'improvement' ? 'selected' : ''}>Improvement</option>
        <option value="fix" ${task.tag === 'fix' ? 'selected' : ''}>Fix</option>
        <option value="future" ${task.tag === 'future' ? 'selected' : ''}>Future</option>
      </select>
    </div>
    <div class="field category"><label>Category</label><input value="${task.category}" data-key="category"></div>
    <div class="field done"><label>Done</label><input type="checkbox" ${task.done ? 'checked' : ''} data-key="done"></div>
    <div class="field locked"><label>Locked</label><input type="checkbox" ${task.locked ? 'checked' : ''} data-key="locked"></div>
  `;

  container.querySelectorAll('[data-key]').forEach(input => {
    input.addEventListener('change', (e) => {
      const key = e.target.dataset.key;
      const value = input.type === 'checkbox' ? input.checked : input.value;
      const oldValue = tasks[selectedTaskIndex][key];
      recordChange(tasks[selectedTaskIndex].id, key, oldValue, value);
      tasks[selectedTaskIndex][key] = value;
      renderTasks();
      renderChangelog();
    });
  });
}

async function saveJSON() {
  try {
    const payload = { tasks, changelog };
    console.log("🔁 Saving payload:", payload);
    console.log("🧾 Payload size (KB):", new Blob([JSON.stringify(payload)]).size / 1024);

    const res = await fetch('/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload, null, 2)
    });

    const text = await res.text();
    try {
      const result = JSON.parse(text);
      alert(result.message || 'Saved');
    } catch (e) {
      console.error('❌ Server did not return valid JSON:', text);
      alert('Server error. See console.');
    }
  } catch (err) {
    alert('Failed to save');
    console.error(err);
  }
}

async function loadJSON() {
  try {
    const res = await fetch('/load-data');
    tasks = await res.json();

    const logRes = await fetch('/load-changelog');
    changelog = await logRes.json();

    renderTasks();
    renderSelectedTask();
    renderChangelog();
  } catch (err) {
    alert('Failed to load tasks');
    console.error(err);
  }
}

function renderChangelog() {
  const container = document.getElementById('changelogPanel');
  if (!container) return;

  const log = changelog
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(entry => {
      const time = new Date(entry.timestamp).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
      });
      return `
        <div class="changelog-date-group">
          <div class="entry-dot"></div>
          <div class="entry-content">
            <div class="entry-description">
              <strong>Task ${entry.taskId}</strong>: ${entry.field} changed from
              <em>"${entry.from}"</em> to <em>"${entry.to}"</em>.
            </div>
            <div class="entry-meta">by ${entry.user} at ${time}</div>
          </div>
        </div>
      `;
    }).join('');

  container.innerHTML = `<div class="changelog-container">${log}</div>`;
}

// Event bindings
document.getElementById('save-btn').onclick = saveJSON;
window.onload = loadJSON;

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tab[role="tab"]');
  const panels = document.querySelectorAll('.tab-panel');
  const themeToggle = document.getElementById('themeToggle');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSelector = tab.getAttribute('data-tab-target');
      const targetPanel = document.querySelector(targetSelector);
      if (!targetPanel) return;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(panel => panel.hidden = true);

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      targetPanel.hidden = false;
      panels.forEach(panel => panel.classList.remove('fade-in'));
      targetPanel.classList.add('fade-in');
    });
  });

  themeToggle.addEventListener('click', () => {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌜' : '🌞';
    themeToggle.setAttribute('aria-label', newTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  });

  // Load tasks initially
  loadJSON();
});