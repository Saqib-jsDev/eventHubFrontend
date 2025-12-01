<?php
// middleware.php
require_once __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$config = require __DIR__ . '/config.php';
$jwtConfig = $config['jwt'];

function get_bearer_token() {
    $headers = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    if (! $headers) return null;
    if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }
    return null;
}
function auth_user() {
    global $pdo, $jwtConfig;
    $token = get_bearer_token();

    if (!$token) {
        http_response_code(401);
        json_response(['error' => 'Token required for this endpoint']);
    }

    try {
        $decoded = JWT::decode($token, new Key($jwtConfig['secret'], 'HS256'));
        
        $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
        $stmt->execute([$decoded->sub]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            json_response(['error' => 'User not found']);
        }

        return $user;
    } catch (Exception $e) {
        http_response_code(401);
        json_response(['error' => 'Invalid or expired token']);
    }
}