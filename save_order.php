<?php
header('Content-Type: application/json');

// Підключення до бази даних
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sheeses_db";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Отримання даних з POST-запиту
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Збереження замовлення
    $stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_phone, customer_email, 
                          delivery_address, comments, total_amount, order_date, status) 
                          VALUES (:name, :phone, :email, :address, :comments, :total, NOW(), 'Нове')");
    
    $stmt->execute([
        ':name' => $data['name'],
        ':phone' => $data['phone'],
        ':email' => $data['email'],
        ':address' => $data['address'],
        ':comments' => $data['comments'],
        ':total' => $data['total']
    ]);
    
    $order_id = $conn->lastInsertId();
    
    // Збереження товарів замовлення
    foreach ($data['items'] as $item) {
        $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_name, product_price, 
                              weight, subtotal) 
                              VALUES (:order_id, :name, :price, :weight, :subtotal)");
        
        $subtotal = $item['price'] * ($item['weight'] ?? 1);
        
        $stmt->execute([
            ':order_id' => $order_id,
            ':name' => $item['title'],
            ':price' => $item['price'],
            ':weight' => $item['weight'] ?? 1,
            ':subtotal' => $subtotal
        ]);
    }
    
    echo json_encode(['success' => true, 'order_id' => $order_id]);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>