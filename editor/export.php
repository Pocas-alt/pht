<h3>Export Filters</h3>
<label>Start Date: <input type="date" id="filter-start-date" /></label>
<label>End Date: <input type="date" id="filter-end-date" /></label>
<label>Done:
    <select id="filter-done">
        <option value="">All</option>
        <option value="true">Done</option>
        <option value="false">Not Done</option>
    </select>
</label>

<button id="export-csv-btn">Export to CSV</button>
<button id="export-new-btn">Export Newly Added</button>

<div id="task-detail" class="task-detail">
    <!-- Optionally add PHP here to show first task details or leave empty for JS control -->
</div>

<script>
    document.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const task = <?= json_encode($tasks) ?>.find(t => t.id == id);
            document.getElementById('form-id').value = task.id;
            document.getElementById('form-title').value = task.title;
            document.getElementById('form-description').value = task.description;
            document.getElementById('form-date').value = task.date;
            document.getElementById('form-tag').value = task.tag;
            document.getElementById('form-category').value = task.category;
            document.getElementById('form-done').checked = !!task.done;
            document.getElementById('form-change-type').value = task.change_type || '';
        });
    });
</script>

<script>
    document.getElementById('export-csv-btn').addEventListener('click', () => {
        const tasks = <?= json_encode($tasks) ?>;
        const startDate = document.getElementById('filter-start-date').value;
        const endDate = document.getElementById('filter-end-date').value;
        const doneFilter = document.getElementById('filter-done').value;

        const filtered = tasks.filter(t => {
            const tDate = new Date(t.date);
            const sDate = startDate ? new Date(startDate) : null;
            const eDate = endDate ? new Date(endDate) : null;
            const inRange = (!sDate || tDate >= sDate) && (!eDate || tDate <= eDate);
            const doneMatch = doneFilter === '' ||
                (doneFilter === 'true' && t.done) ||
                (doneFilter === 'false' && !t.done);
            return inRange && doneMatch;
        });

        const header = ['ID', 'Title', 'Description', 'Date', 'Tag', 'Category', 'Done'];
        const rows = filtered.map(t => [
            t.id,
            `"${(t.title || '').replace(/"/g, '""')}"`,
            `"${(t.description || '').replace(/"/g, '""')}"`,
            t.date,
            t.tag,
            t.category,
            t.done ? 'Yes' : 'No'
        ]);

        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filtered-tasks.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
</script>

<script>
    document.getElementById('export-new-btn').addEventListener('click', () => {
        const tasks = <?= json_encode($tasks) ?>;
        const addedTasks = tasks.filter(t => t.change_type === 'added');

        const header = ['ID', 'Title', 'Description', 'Date', 'Tag', 'Category', 'Done'];
        const rows = addedTasks.map(t => [
            t.id,
            `"${(t.title || '').replace(/"/g, '""')}"`,
            `"${(t.description || '').replace(/"/g, '""')}"`,
            t.date,
            t.tag,
            t.category,
            t.done ? 'Yes' : 'No'
        ]);

        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newly-added-tasks.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
</script>