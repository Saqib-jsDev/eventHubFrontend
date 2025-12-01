<?php
// test-config.php → sirf config load test

echo "1. PHP Working<br>";
require_once __DIR__ . '/vendor/autoload.php';
echo "2. JWT Library Loaded<br>";

if (file_exists(__DIR__ . '/config.php')) {
    echo "3. config.php FILE FOUND!<br>";
    $config = require __DIR__ . '/config.php';
    echo "4. config.php LOADED SUCCESSFULLY!<br>";
    echo "<pre>";
    print_r($config['db']);
    echo "</pre>";
} else {
    echo "ERROR: config.php FILE NOT FOUND in " . __DIR__ . "<br>";
    echo "Files in current folder:<br>";
    print_r(scandir(__DIR__));
}