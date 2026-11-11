<?php

require_once __DIR__ . '/vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$adress = $data['adress'] ?? '';
$postalCode = $data['postalCode'] ?? '';
$city = $data['city'] ?? '';
$phoneNumber = $data['phoneNumber'] ?? '';
$product = $data['product'] ?? '';
$productName = $product['name'] ?? '';

function sendEmail($name, $email, $adress, $city, $productName) {
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Het email adres is niet geldig!');
    }

    $api_key = getenv('RESEND_KAPPER_API_KEY');
    $afzender = getenv('RESEND_KAPPER_AFZENDER');

    if (!$api_key || !$afzender) {
        throw new runtimeException('De API key is niet geldig');
    }

    $emailBody = ([
        'from' => $afzender,
        'to' => $email,
        'subject' => 'Nieuwe bestelling',
        'text' =>
            "Hallo $name\n\n Bedankt voor je bestelling van $productName. Dit product wordt binnen enkele werkdagen verzonden naar $adress, $city. \n\n Mocht uw vragen hebben: neem dan gerust contact op. \n\n Elsa's kapsalon."
    ]);
    try {
        $client = \Resend::client($api_key);
        $client->emails->send($emailBody);
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch (\Exception $e) {
        error_log($e->getMessage());
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'De e-mail kon niet worden verstuurd.'
       ]);
    }
}

sendEmail($name, $email, $adress, $city, $productName);
