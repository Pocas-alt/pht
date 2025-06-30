<?php
require_once('../Database.php');
$db = Database::connect();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? null;
  $title = $_POST['title'] ?? '';
  $description = $_POST['description'] ?? '';
  $tag = $_POST['tag'] ?? '';
  $date = $_POST['date'] ?? date('Y-m-d');
  $category = $_POST['category'] ?? '';
  $change_type = $_POST['change_type'] ?? null;

  if (isset($_POST['delete']) && $id) {
    $stmt = $db->prepare("UPDATE tasks SET change_type = 'deleted' WHERE id = ?");
    $stmt->execute([$id]);
  } elseif ($id) {
    $stmt = $db->prepare("UPDATE tasks SET title=?, description=?, tag=?, date=?, category=?, change_type='updated' WHERE id=?");
    $stmt->execute([$title, $description, $tag, $date, $category, $id]);
  } else {
    $stmt = $db->prepare("INSERT INTO tasks (title, description, tag, date, category, change_type) VALUES (?, ?, ?, ?, ?, 'added')");
    $stmt->execute([$title, $description, $tag, $date, $category]);
  }

  header("Location: editor.php");
  exit;
}

$tasks = $db->query("SELECT * FROM tasks WHERE change_type IS NULL OR change_type != 'deleted' ORDER BY date DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en" data-theme="dark"> <!-- 'data-theme' controls theme -->

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Task Editor App</title>
  <link rel="stylesheet" href="../styles/index.css" />
  <link rel="stylesheet" href="../styles/components/timeline.css" />
  <link rel="stylesheet" href="../styles/components/buttons.css" />
  <link rel="stylesheet" href="../styles/components/changelog.css" />
</head>

<body>
  <h1>Task Editor</h1>
  <div class="editor-wrapper">
    <div id="task-list" class="task-list">
      <?php foreach ($tasks as $task): ?>
        <div class="task-box" data-id="<?= htmlspecialchars($task['id']) ?>">
          <span class="task-date"><?= htmlspecialchars($task['date']) ?></span>
          <?= htmlspecialchars($task['title']) ?>
        </div>
      <?php endforeach; ?>
    </div>

    <aside class="sidebar">
      <?php require 'crud.php'; ?>
      <?php require 'export.php'; ?>
    </aside>
  </div>
  <script>
    document.querySelectorAll('.task-box').forEach(box => {
      box.addEventListener('click', () => {
        const id = box.dataset.id;
        const form = document.querySelector('form');
        if (!form) return;

        document.querySelectorAll('.task-box').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');

        const task = <?= json_encode($tasks) ?>.find(t => t.id == id);
        if (!task) return;

        form.querySelector('[name="id"]').value = task.id;
        form.querySelector('[name="title"]').value = task.title;
        form.querySelector('[name="description"]').value = task.description;
        form.querySelector('[name="tag"]').value = task.tag;
        form.querySelector('[name="date"]').value = task.date;
        form.querySelector('[name="category"]').value = task.category;
      });
    });
  </script>
</body>

</html>