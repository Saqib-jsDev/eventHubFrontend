<?php
require_once __DIR__ . '/cors.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($uri, '/');

if ($path === '' || $path === 'index.php') {
    echo json_encode(['message' => 'EventHub API is Live!', 'status' => 'success']);
    exit;
}

$file = __DIR__ . '/' . $path;

if (file_exists($file) && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
    require $file;
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Route not found']);