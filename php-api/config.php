<?php
require_once __DIR__ . '/cors.php';
return [
    'db' => [
        'host'    => 'sql108.byethost9.com',
        'dbname'  => 'b9_40562121_eventhub',
        'user'    => 'b9_40562121',
        'pass'    => 'BiqasAli188vistapanel',
        'port'    => 3306,
        'charset' => 'utf8mb4'
    ],
    'jwt' => [
        'secret'   => 'eventhub2025supersecret12345678901234567890',
        'issuer'   => 'https://eventhub.byethost9.com',
        'audience' => 'eventhub.byethost9.com',
        'expiry'   => 3600
    ]
];