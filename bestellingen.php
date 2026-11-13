<?php 
$data = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$adress = $data['adress'] ?? '';
$postalCode = $data['postalCode'] ?? '';
$city = $data['city'] ?? '';
$phoneNumber = $data['phoneNumber'] ?? '';

$host = getenv('DB_HOST');
$dbname = getenv('DB_NAME');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$port = getenv('DB_PORT');

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
try {
    $pdo = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    header('Content-Type: application/json');
    $send_data = ["success" => false];
    echo json_encode($send_data);
}

$productId = $data['product']['id'];
$productPrice = $data['product']['price'];

$sql = "UPDATE products SET stock = stock - 1 WHERE id = :id AND stock > 0";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    "id" => $productId
]);

$success = $stmt->rowCount() > 0;

header('Content-Type: application/json');
if ($success) {
    $send_data = ["success" => true];
} else {
    $send_data = ["success" => false];
}
echo json_encode($send_data);
