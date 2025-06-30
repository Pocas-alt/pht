<!DOCTYPE html>
<html lang="lt" data-theme="dark">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Visi atnaujinimai — Pagal mėnesį</title>
  <link rel="stylesheet" href="styles/index.css" />
  <link rel="stylesheet" href="styles/components/timeline.css" />
  <link rel="stylesheet" href="styles/components/buttons.css" />
  <link rel="stylesheet" href="styles/components/changelog.css" />
</head>

<body>
  <div class="page-wrapper">
    <button id="theme-toggle">Perjungti temą 💡</button>
    <div class="changelog-container">
      <h1>Sistemos atnaujinimai</h1>
      <?php
      require_once 'Database.php';
      $db = Database::connect();
      $tasks = $db->query("SELECT * FROM tasks ORDER BY date DESC")->fetchAll(PDO::FETCH_ASSOC);

      $currentMonth = '';

      foreach ($tasks as $task) {
        $monthLabel = date('F Y', strtotime($task['date']));
        if ($monthLabel !== $currentMonth) {
          echo '<div class="timeline-month"><h2>' . htmlspecialchars($monthLabel) . '</h2></div>';
          $currentMonth = $monthLabel;
        }

        echo '<div class="timeline-item">';
        echo '  <div class="timeline-date">' . htmlspecialchars($task['date']) . '</div>';
        echo '  <section class="changelog-entry ' . htmlspecialchars($task['tag']) . '">';
        echo '    <div class="entry-header">';
        echo '      <span class="entry-tag ' . htmlspecialchars($task['tag']) . '">' . htmlspecialchars($task['tag']) . '</span>';
        echo '      <span class="entry-id">#' . htmlspecialchars($task['id']) . '</span>';
        echo '    </div>';
        echo '    <h3 class="entry-title">' . htmlspecialchars($task['title']) . '</h3>';
        echo '    <p class="entry-description">' . nl2br(htmlspecialchars($task['description'])) . '</p>';
        echo '  </section>';
        echo '</div>';
      }
      ?>

      <a href="https://pocas-alt.github.io/pro-implant-how-to/" target="_self">
        <button id="back-to-proimplant-guide" class="back-to-proimplant-guide" title="Grįžti į Pro-implant Gidą">
          Grįžti į Pro-implant Gidą
        </button>
      </a>

      <script>
        const toggleButton = document.getElementById('theme-toggle');
        const htmlEl = document.documentElement;

        toggleButton.addEventListener('click', () => {
          const current = htmlEl.getAttribute('data-theme') || 'dark';
          const next = current === 'dark' ? 'light' : 'dark';
          htmlEl.setAttribute('data-theme', next);
          localStorage.setItem('theme', next);
        });

        // Apply saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          htmlEl.setAttribute('data-theme', savedTheme);
        }
      </script>
      <script>
        function tagLabel(tag) {
          const labels = {
            new: 'New',
            fix: 'Fix',
            update: 'Update',
            improvement: 'Improvement',
            future: 'Planned'
          };
          return labels[tag] || tag;
        }

        function animateItems() {
          const items = document.querySelectorAll('.timeline-month, .timeline-item');
          const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });

          items.forEach(item => observer.observe(item));
        }

        document.addEventListener("DOMContentLoaded", animateItems);
      </script>
      <script>
        function applyMobileClass() {
          if (window.innerWidth <= 600) {
            document.body.classList.add('timeline-mobile');
          } else {
            document.body.classList.remove('timeline-mobile');
          }
        }

        applyMobileClass();
        window.addEventListener('resize', applyMobileClass);
      </script>
    </div>
    <script src="assets/scripts/flip.js"></script>
    <script>
      document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
          item.classList.toggle('flipped');
        });
      });
    </script>
</body>

</html>