<?php
header('Content-Type: application/json');

// Проверяем, установлен ли уже сайт
if (file_exists(__DIR__ . '/data/site.db')) {
    http_response_code(400);
    echo json_encode(['error' => 'Site is already installed']);
    exit;
}

try {
    // Создаем директорию data если её нет
    if (!file_exists(__DIR__ . '/data')) {
        mkdir(__DIR__ . '/data', 0755, true);
    }

    // Создаем базу данных
    $db = new SQLite3(__DIR__ . '/data/site.db');
    $db->enableExceptions(true);

    // Создаем таблицы
    $db->exec("
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            discount INTEGER DEFAULT 0,
            image_url TEXT NOT NULL,
            category_id TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    ");

    // Добавляем категории
    $categories = [
        ['dlc', 'Дополнения'],
        ['skins', 'Скины'],
        ['weapons', 'Оружие'],
        ['passes', 'Сезонные пропуски']
    ];

    $stmt = $db->prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
    foreach ($categories as $cat) {
        $stmt->reset();
        $stmt->bindValue(1, $cat[0]);
        $stmt->bindValue(2, $cat[1]);
        $stmt->execute();
    }

    // Добавляем тестовые товары
    $products = [
        [
            'elden-ring-dlc',
            'Elden Ring: Shadow of the Erdtree',
            'Новое масштабное дополнение для Elden Ring',
            29.99,
            0,
            'https://images.unsplash.com/photo-1614294148960-9aa740632a87',
            'dlc'
        ],
        [
            'cyberpunk-skin',
            'Cyberpunk Chrome Pack',
            'Набор хромированных скинов',
            9.99,
            20,
            'https://images.unsplash.com/photo-1605979257913-1704eb7b6246',
            'skins'
        ]
    ];

    $stmt = $db->prepare('
        INSERT INTO products (id, name, description, price, discount, image_url, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ');

    foreach ($products as $prod) {
        $stmt->reset();
        $stmt->bindValue(1, $prod[0]);
        $stmt->bindValue(2, $prod[1]);
        $stmt->bindValue(3, $prod[2]);
        $stmt->bindValue(4, $prod[3]);
        $stmt->bindValue(5, $prod[4]);
        $stmt->bindValue(6, $prod[5]);
        $stmt->bindValue(7, $prod[6]);
        $stmt->execute();
    }

    // Добавляем настройки
    $settings = [
        ['site_name', 'SC Game - Gaming DLC Marketplace'],
        ['header_image', 'https://images.unsplash.com/photo-1542751371-adc38448a05e'],
        ['contact_email', 'support@sc-game.ru']
    ];

    $stmt = $db->prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    foreach ($settings as $setting) {
        $stmt->reset();
        $stmt->bindValue(1, $setting[0]);
        $stmt->bindValue(2, $setting[1]);
        $stmt->execute();
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>