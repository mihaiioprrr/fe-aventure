<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);

$b = getRequestBody();
$name    = trim($b['name'] ?? '');
$email   = trim($b['email'] ?? '');
$phone   = trim($b['phone'] ?? '');
$offer   = trim($b['offer_id'] ?? '');
$title   = trim($b['offer_title'] ?? '');
$message = trim($b['message'] ?? '');

if (!$name || !$email || !$phone) jsonResponse(['ok' => false, 'error' => 'Câmpurile obligatorii lipsesc.'], 422);

$db = getDB();
$stmt = $db->prepare('INSERT INTO reservations (name,email,phone,offer_id,offer_title,message) VALUES (?,?,?,?,?,?)');
$stmt->execute([$name, $email, $phone, $offer, $title, $message]);

jsonResponse(['ok' => true], 201);
