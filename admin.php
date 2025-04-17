<?php
session_start();

// Перевірка авторизації
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: admin_login.php');
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
    
    // Отримання замовлень
    $stmt = $conn->query("SELECT * FROM orders ORDER BY order_date DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Для кожного замовлення отримуємо товари
    foreach ($orders as &$order) {
        $stmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
} catch(PDOException $e) {
    die("Помилка підключення: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Адмін-панель - Sheeses</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .admin-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .order {
            border: 1px solid #ddd;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 5px;
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .order-id {
            font-weight: bold;
            color: #2c3e50;
        }
        .order-date {
            color: #7f8c8d;
        }
        .order-status {
            padding: 5px 10px;
            border-radius: 3px;
            font-weight: bold;
        }
        .status-new {
            background-color: #f39c12;
            color: white;
        }
        .status-processing {
            background-color: #3498db;
            color: white;
        }
        .status-completed {
            background-color: #2ecc71;
            color: white;
        }
        .status-cancelled {
            background-color: #e74c3c;
            color: white;
        }
        .order-customer {
            margin-bottom: 10px;
        }
        .order-items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .order-items th, .order-items td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .order-items th {
            background-color: #f2f2f2;
        }
        .order-total {
            text-align: right;
            margin-top: 10px;
            font-weight: bold;
            font-size: 1.1em;
        }
        .status-form {
            margin-top: 10px;
        }
        select, button {
            padding: 5px 10px;
        }
        .logout-btn {
            display: block;
            text-align: right;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="logout-btn">
            <a href="admin_logout.php" style="color: #e74c3c; text-decoration: none;">
                <i class="fas fa-sign-out-alt"></i> Вийти
            </a>
        </div>
        
        <h1>Адмін-панель - Замовлення</h1>
        
        <?php foreach ($orders as $order): ?>
        <div class="order">
            <div class="order-header">
                <div>
                    <span class="order-id">Замовлення #<?= htmlspecialchars($order['id']) ?></span>
                    <span class="order-date"> - <?= date('d.m.Y H:i', strtotime($order['order_date'])) ?></span>
                </div>
                <span class="order-status status-<?= strtolower($order['status']) ?>">
                    <?= htmlspecialchars($order['status']) ?>
                </span>
            </div>
            
            <div class="order-customer">
                <p><strong>Клієнт:</strong> <?= htmlspecialchars($order['customer_name']) ?></p>
                <p><strong>Телефон:</strong> <?= htmlspecialchars($order['customer_phone']) ?></p>
                <p><strong>Email:</strong> <?= htmlspecialchars($order['customer_email']) ?></p>
                <p><strong>Адреса:</strong> <?= htmlspecialchars($order['delivery_address']) ?></p>
                <?php if (!empty($order['comments'])): ?>
                <p><strong>Коментар:</strong> <?= htmlspecialchars($order['comments']) ?></p>
                <?php endif; ?>
            </div>
            
            <table class="order-items">
                <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Ціна (за кг)</th>
                        <th>Вага (кг)</th>
                        <th>Сума</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($order['items'] as $item): ?>
                    <tr>
                        <td><?= htmlspecialchars($item['product_name']) ?></td>
                        <td><?= number_format($item['product_price'], 2) ?> ₴</td>
                        <td><?= number_format($item['weight'], 3) ?></td>
                        <td><?= number_format($item['subtotal'], 2) ?> ₴</td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            
            <div class="order-total">
                Загальна сума: <?= number_format($order['total_amount'], 2) ?> ₴
            </div>
            
            <form class="status-form" action="update_order_status.php" method="post">
                <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                <select name="new_status">
                    <option value="Нове" <?= $order['status'] == 'Нове' ? 'selected' : '' ?>>Нове</option>
                    <option value="В обробці" <?= $order['status'] == 'В обробці' ? 'selected' : '' ?>>В обробці</option>
                    <option value="Виконано" <?= $order['status'] == 'Виконано' ? 'selected' : '' ?>>Виконано</option>
                    <option value="Скасовано" <?= $order['status'] == 'Скасовано' ? 'selected' : '' ?>>Скасовано</option>
                </select>
                <button type="submit">Оновити статус</button>
            </form>
        </div>
        <?php endforeach; ?>
    </div>
</body>
</html>