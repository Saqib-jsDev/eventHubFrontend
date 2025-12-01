<?php
require __DIR__ . "/db.php";

$sql = file_get_contents(__DIR__ . "/init.sql");

try {
    $pdo->exec($sql);
    echo "Migration completed successfully.";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
