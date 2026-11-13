<?php
/**
 * Demon Slayer Corps Messenger Endpoint (Contact Form API)
 * Handles incoming transmission requests for Mark Dave Acuña
 */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Allow local development CORS if accessed via different local port
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Only POST transmissions are permitted by the Demon Slayer Corps headquarters.'
    ]);
    exit;
}

// Read raw POST data or form data
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    $data = $_POST;
}

// Honeypot spam check
if (!empty($data['demon_trap'])) {
    // Hidden honeypot field filled by bot
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Kasugai Crow dispatched successfully!'
    ]);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? 'New Demon Slayer Corps Inquiry');
$message = trim($data['message'] ?? '');

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors['name'] = 'Please provide your name (at least 2 characters).';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'A valid Kasugai Crow email address is required.';
}

if (empty($message) || strlen($message) < 5) {
    $errors['message'] = 'Mission dispatch details must be at least 5 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'status' => 'error',
        'errors' => $errors,
        'message' => 'Validation failed. Please correct the highlighted errors.'
    ]);
    exit;
}

// Prepare transmission payload
$sanitizedName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$sanitizedEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$sanitizedSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$sanitizedMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
$timestamp = date('Y-m-d H:i:s');
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';

// Log to inquiries file (acts as lightweight local DB storage)
$logEntry = [
    'id' => uniqid('CORPS_MSG_'),
    'timestamp' => $timestamp,
    'sender_name' => $sanitizedName,
    'sender_email' => $sanitizedEmail,
    'subject' => $sanitizedSubject,
    'message' => $sanitizedMessage,
    'ip' => $clientIp
];

$storageDir = __DIR__ . '/../data';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}

$storageFile = $storageDir . '/messages.json';
$messages = [];
if (file_exists($storageFile)) {
    $existing = @file_get_contents($storageFile);
    $decoded = json_decode($existing, true);
    if (is_array($decoded)) {
        $messages = $decoded;
    }
}

$messages[] = $logEntry;
@file_put_contents($storageFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Success response
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Caw! Caw! Kasugai Crow has taken flight! Your transmission has reached Mark Dave Acuña.',
    'mission_id' => $logEntry['id'],
    'timestamp' => $timestamp
]);
