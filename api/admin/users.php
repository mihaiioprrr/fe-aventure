<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

$db = getDB();

// Verify admin token
$headers = getallheaders();
$token = $headers['X-User-Id'] ?? '';
$role  = $headers['X-User-Role'] ?? '';

if ($role !== 'admin') {
    jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query('SELECT id, name, email, birthdate, role, created_at FROM users ORDER BY created_at DESC');
    jsonResponse(['ok' => true, 'users' => $stmt->fetchAll()]);
}

if ($method === 'PATCH') {
    $body = getRequestBody();
    $id   = (int)($body['id'] ?? 0);
    $role_new = $body['role'] ?? '';
    if (!$id || !in_array($role_new, ['user', 'admin'])) jsonResponse(['ok' => false, 'error' => 'Date invalide.'], 422);
    $db->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$role_new, $id]);
    jsonResponse(['ok' => true]);
}

if ($method === 'DELETE') {
    $body = getRequestBody();
    $id = (int)($body['id'] ?? 0);
    if (!$id) jsonResponse(['ok' => false, 'error' => 'ID invalid.'], 422);

    $stmt = $db->prepare('SELECT role FROM users WHERE id = ?');
    $stmt->execute([$id]);
    $target = $stmt->fetch();

    if (!$target) jsonResponse(['ok' => false, 'error' => 'Userul nu există.'], 404);
    if ($target['role'] === 'admin') jsonResponse(['ok' => false, 'error' => 'Nu poți șterge un admin.'], 403);

    $db->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
