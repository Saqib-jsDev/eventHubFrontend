<?php
    require_once __DIR__ . '/cors.php';
echo "1. PHP Working<br>";

require_once __DIR__ . '/vendor/autoload.php';
echo "2. JWT Library Loaded<br>";

require_once __DIR__ . '/db.php';
echo "3. DB Connected! PDO: " . get_class($pdo) . "<br>";

require_once __DIR__ . '/middleware.php';
echo "4. Middleware Loaded<br>";

echo "ALL GOOD! API Ready!";