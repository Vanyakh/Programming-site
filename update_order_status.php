<?php
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Підключення до бази даних
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sheeses_db";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $order_id = $_POST['order_id'];
    $new_status = $_POST['new_status'];
    
    $stmt = $conn->prepare("UPDATE orders SET status = :status WHERE id = :id");
    $stmt->execute([':status' => $new_status, ':id' => $order_id]);
    
    header('Location: admin.php');
    
} catch(PDOException $e) {
    die("Помилка підключення: " . $e->getMessage());
}
?>