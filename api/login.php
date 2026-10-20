<?php
require_once __DIR__ . '/config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
}

$body = getRequestBody();

$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) {
    jsonResponse(['ok' => false, 'error' => 'Email și parolă sunt obligatorii.'], 422);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id, name, email, password, role, phone FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['ok' => false, 'error' => 'Email sau parolă incorectă.'], 401);
    }

    jsonResponse([
        'ok'   => true,
        'user' => [
            'id'    => (int)$user['id'],
            'email' => $user['email'],
            'name'  => $user['name'],
            'role'  => $user['role'],
            'phone' => $user['phone'] ?? '',
        ],
    ]);

} catch (PDOException $e) {
    jsonResponse(['ok' => false, 'error' => 'Eroare de server. Încearcă din nou.'], 500);
}
