<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;

$config = require __DIR__ . '/config.php';
$jwtConfig = $config['jwt'];

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

if ($method === 'OPTIONS') { http_response_code(200); exit; }

$input = get_json_input();

if ($method === 'POST' && strpos($path, '/register') !== false) {
    // register
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $role = 'resident'; // default

    if (!$name || !$email || !$password) {
        json_response(['error' => 'name, email and password required'], 422);
    }

    // check existing
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(['error' => 'Email already exists'], 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $hash, $role]);
    $id = $pdo->lastInsertId();

    // AUTO LOGIN AFTER REGISTER
    $now = time();
    $payload = [
        'iss' => $jwtConfig['issuer'],
        'aud' => $jwtConfig['aud'],
        'iat' => $now,
        'nbf' => $now,
        'exp' => $now + $jwtConfig['expiry'],
        'sub' => $id
    ];
    $token = JWT::encode($payload, $jwtConfig['secret'], 'HS256');

    json_response([
        'message' => 'User created and logged in',
        'token' => $token,
        'user' => [ 'name' => $name,  'role' => $role]
    ], 201);
}

if ($method === 'POST' && strpos($path, '/login') !== false) {
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        json_response(['error' => 'email and password required'], 422);
    }

    $stmt = $pdo->prepare('SELECT id, password, name, role FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password'])) {
        json_response(['error' => 'Invalid credentials'], 401);
    }

    $now = time();
    $payload = [
        'iss' => $jwtConfig['issuer'],
        'aud' => $jwtConfig['aud'],
        'iat' => $now,
        'nbf' => $now,
        'exp' => $now + $jwtConfig['expiry'],
        'sub' => $user['id']
    ];

    $token = JWT::encode($payload, $jwtConfig['secret'], 'HS256');

    json_response(['token' => $token, 'user' => [ 'name' => $user['name'], 'role' => $user['role']]], 200);
}

// if not matched
json_response(['error' => 'Not Found'], 404);
