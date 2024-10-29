<?php
header('Content-Type: application/json');

try {
    $db = new SQLite3(__DIR__ . '/data/site.db');
    $db->enableExceptions(true);

    $path = substr($_SERVER['REQUEST_URI'], 5); // убираем /api/
    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true);

    switch ($path) {
        case 'products':
            if ($method === 'GET') {
                $results = $db->query('SELECT * FROM products');
                $products = [];
                while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
                    $products[] = $row;
                }
                echo json_encode($products);
            }
            else if ($method === 'POST') {
                $stmt = $db->prepare('
                    INSERT INTO products (id, name, description, price, discount, image_url, category_id)
                    VALUES (:id, :name, :description, :price, :discount, :image_url, :category_id)
                ');
                $stmt->bindValue(':id', $data['id']);
                $stmt->bindValue(':name', $data['name']);
                $stmt->bindValue(':description', $data['description']);
                $stmt->bindValue(':price', $data['price']);
                $stmt->bindValue(':discount', $data['discount']);
                $stmt->bindValue(':image_url', $data['image_url']);
                $stmt->bindValue(':category_id', $data['category_id']);
                $stmt->execute();
                echo json_encode(['success' => true]);
            }
            break;

        case (preg_match('/^products\/(.+)$/', $path, $matches) ? true : false):
            $id = $matches[1];
            if ($method === 'PUT') {
                $stmt = $db->prepare('
                    UPDATE products 
                    SET name = :name, description = :description, price = :price,
                        discount = :discount, image_url = :image_url, category_id = :category_id
                    WHERE id = :id
                ');
                $stmt->bindValue(':id', $id);
                $stmt->bindValue(':name', $data['name']);
                $stmt->bindValue(':description', $data['description']);
                $stmt->bindValue(':price', $data['price']);
                $stmt->bindValue(':discount', $data['discount']);
                $stmt->bindValue(':image_url', $data['image_url']);
                $stmt->bindValue(':category_id', $data['category_id']);
                $stmt->execute();
                echo json_encode(['success' => true]);
            }
            else if ($method === 'DELETE') {
                $stmt = $db->prepare('DELETE FROM products WHERE id = :id');
                $stmt->bindValue(':id', $id);
                $stmt->execute();
                echo json_encode(['success' => true]);
            }
            break;

        case 'categories':
            if ($method === 'GET') {
                $results = $db->query('SELECT * FROM categories');
                $categories = [];
                while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
                    $categories[] = $row;
                }
                echo json_encode($categories);
            }
            break;

        case 'settings':
            if ($method === 'GET') {
                $results = $db->query('SELECT * FROM settings');
                $settings = [];
                while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
                    $settings[$row['key']] = $row['value'];
                }
                echo json_encode($settings);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
    }

    $db->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>