<?php
// Создаем директорию для базы если её нет
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

try {
    // Создаем базу данных
    $db = new SQLite3($dataDir . '/marketplace.db');
    $db->enableExceptions(true);

    // Создаем таблицы
    $db->exec("
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            discount REAL DEFAULT 0,
            image_url TEXT NOT NULL,
            category_id TEXT,
            duration_days INTEGER
        );

        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    ");

    // Добавляем начальные данные если таблицы пустые
    $count = $db->querySingle("SELECT COUNT(*) FROM categories");

    if ($count == 0) {
        // Категории
        $categories = [
            ['dlc', 'Дополнения'],
            ['skins', 'Скины'],
            ['weapons', 'Оружие'],
            ['season-pass', 'Сезонные пропуски']
        ];

        foreach ($categories as $cat) {
            $db->exec("INSERT INTO categories (id, name) VALUES ('{$cat[0]}', '{$cat[1]}')");
        }

        // Настройки
        $settings = [
            'site_name' => 'SC Game - Gaming DLC Marketplace',
            'header_image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
            'copyright' => '© 2024 sc-game.ru. Все права защищены.',
            'contact_email' => 'support@sc-game.ru',
            'contact_phone' => '+7 (999) 123-45-67',
            'contact_address' => 'г. Москва, ул. Игровая, д. 42'
        ];

        foreach ($settings as $key => $value) {
            $db->exec("INSERT INTO settings (key, value) VALUES ('$key', '$value')");
        }
    }

    $db->close();
    echo "База данных успешно инициализирована\n";
} catch (Exception $e) {
    echo "Ошибка: " . $e->getMessage() . "\n";
}
?>