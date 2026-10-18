<?php
header('Content-Type: application/json; charset=utf-8');
try {
    $db = new PDO('mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_DATABASE') . ';charset=utf8mb4', getenv('DB_USERNAME'), getenv('DB_PASSWORD'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo json_encode(['service' => 'PHP', 'version' => PHP_VERSION, 'database' => $db->query('SELECT 1')->fetchColumn()]);
} catch (Throwable $error) {
    http_response_code(503);
    error_log($error->getMessage());
    echo json_encode(['database' => 'unavailable']);
}
