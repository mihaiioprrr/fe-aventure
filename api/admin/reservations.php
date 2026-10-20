<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

$headers = getallheaders();
$role = $headers['X-User-Role'] ?? '';
if ($role !== 'admin') jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query('SELECT * FROM reservations ORDER BY created_at DESC');
    jsonResponse(['ok' => true, 'reservations' => $stmt->fetchAll()]);
}

if ($method === 'PATCH') {
    $body = getRequestBody();
    $id     = (int)($body['id'] ?? 0);
    $status = $body['status'] ?? '';
    $allowed = ['noua','in_progres','confirmata','anulata'];
    if (!$id || !in_array($status, $allowed)) jsonResponse(['ok' => false, 'error' => 'Date invalide.'], 422);
    $db->prepare('UPDATE reservations SET status = ? WHERE id = ?')->execute([$status, $id]);
    jsonResponse(['ok' => true]);
}

if ($method === 'DELETE') {
    $body = getRequestBody();
    $id = (int)($body['id'] ?? 0);
    if (!$id) jsonResponse(['ok' => false, 'error' => 'ID invalid.'], 422);
    $db->prepare('DELETE FROM reservations WHERE id = ?')->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
