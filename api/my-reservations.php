<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
}

$headers   = getallheaders();
$user_id   = (int)($headers['X-User-Id'] ?? 0);
$user_email = trim($headers['X-User-Email'] ?? '');

if (!$user_id || !$user_email) {
    jsonResponse(['ok' => false, 'error' => 'Autentificare necesară.'], 401);
}

// Verify the user exists and the email matches the id (basic guard)
$db = getDB();
$chk = $db->prepare('SELECT id FROM users WHERE id = ? AND email = ?');
$chk->execute([$user_id, $user_email]);
if (!$chk->fetch()) {
    jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
}

$stmt = $db->prepare('SELECT * FROM reservations WHERE email = ? ORDER BY created_at DESC');
$stmt->execute([$user_email]);
$reservations = $stmt->fetchAll();

jsonResponse(['ok' => true, 'reservations' => $reservations]);
