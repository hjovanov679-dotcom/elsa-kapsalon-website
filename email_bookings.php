<?php
require_once __DIR__ . '/vendor/autoload.php';
$data = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);

$name = $data['name'];
$phone = $data['phone'];
$email = $data['email'];
$date = $data['date'];
$time = $data['time'];
$service = $data['service'];

function sendEmailBooking($name, $phone, $email, $date, $time, $service) {
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
        'subject' => 'Afspraak Bevestiging',
        'text' =>
            "Hallo $name\n\n Bedankt voor je afspraak voor $service op $date om $time. \n\n Mocht uw vragen hebben: neem dan gerust contact op. \n\n Elsa's kapsalon."
    ]);
    try {
        $client = \Resend::client($api_key);
        $client->emails->send($emailBody);
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch (\Exception $e) {
        throw new RuntimeException('Er is een fout opgetreden bij het verzenden van de email: ' . $e->getMessage());
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

sendEmailBooking($name, $phone, $email, $date, $time, $service);