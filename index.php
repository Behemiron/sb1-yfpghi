<?php
// Проверяем установлен ли сайт
if (!file_exists(__DIR__ . '/data/site.db') && !strpos($_SERVER['REQUEST_URI'], 'install.php')) {
    header('Location: /install.php');
    exit;
}

// Если запрос к API
if (strpos($_SERVER['REQUEST_URI'], '/api/') === 0) {
    require __DIR__ . '/api.php';
    exit;
}

// Для всех остальных запросов отдаем собранный React
readfile(__DIR__ . '/dist/index.html');
?>