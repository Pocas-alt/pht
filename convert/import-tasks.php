<?php
$config = require __DIR__ . '/config.php';

$db = Database::connect();

// 1. Read file
$input = file_get_contents('import-tasks.txt');
$lines = explode("\n", $input);
$currentDate = '';
$currentCategory = '';
$tasks = [];

foreach ($lines as $line) {
    $line = trim($line);

    // Match date line: 25/06/03
    if (preg_match('/^\d{2}\/\d{2}\/\d{2}$/', $line)) {
        $currentDate = DateTime::createFromFormat('y/m/d', str_replace('/', '/', $line))->format('Y-m-d');
        continue;
    }

    // Match category title
    if ($line && !str_starts_with($line, '-') && !preg_match('/^\d{2}\/\d{2}\/\d{2}$/', $line)) {
        $currentCategory = $line;
        continue;
    }

    // Match task line
    if (preg_match('/^- \[( |x)\] (.+?)(?: \{(\d+)\})?$/i', $line, $matches)) {
        $done = strtolower($matches[1]) === 'x' ? 1 : 0;
        $fullText = trim($matches[2]);
        $id = isset($matches[3]) ? (int) $matches[3] : null;
        $title = explode('.', $fullText)[0];

        $tasks[] = [
            'id' => $id ?? null,
            'title' => $title,
            'description' => $fullText,
            'tag' => 'todo',
            'date' => $currentDate ?: date('Y-m-d'),
            'category' => $currentCategory,
            'status' => $done ? 'done' : 'planned',
            'change_type' => 'added'
        ];
    }
}

// 2. Preview the parsed tasks
echo "===== Parsed Tasks Preview =====\n\n";
foreach ($tasks as $task) {
    echo "- ID: {$task['id']}\n";
    echo "  Title: {$task['title']}\n";
    echo "  Description: {$task['description']}\n";
    echo "  Date: {$task['date']}\n";
    echo "  Category: {$task['category']}\n";
    echo "  Status: {$task['status']}\n";
    echo "  Tag: {$task['tag']}, Change Type: {$task['change_type']}\n";
    echo "----------------------------------------\n";
}

// 3. Ask for confirmation
echo "Do you want to insert these tasks into the database? (yes/no): ";
$handle = fopen("php://stdin", "r");
$confirm = trim(fgets($handle));
fclose($handle);

if (strtolower($confirm) !== 'yes') {
    echo "❌ Import cancelled.\n";
    exit;
}

// 4. Import into DB
foreach ($tasks as $task) {
    if ($task['id'] !== null) {
        $stmt = $db->prepare("INSERT INTO tasks (id, title, description, tag, date, category, status, change_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $task['id'],
            $task['title'],
            $task['description'],
            $task['tag'],
            $task['date'],
            $task['category'],
            $task['status'],
            $task['change_type']
        ]);
    } else {
        $stmt = $db->prepare("INSERT INTO tasks (title, description, tag, date, category, status, change_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $task['title'],
            $task['description'],
            $task['tag'],
            $task['date'],
            $task['category'],
            $task['status'],
            $task['change_type']
        ]);
    }
}

echo "✅ Import successful.\n";