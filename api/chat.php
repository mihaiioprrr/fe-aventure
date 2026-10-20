<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$headers   = getallheaders();
$user_id   = (int)($headers['X-User-Id'] ?? 0);
$user_email = trim($headers['X-User-Email'] ?? '');

if (!$user_id || !$user_email) {
    jsonResponse(['ok' => false, 'error' => 'Autentificare necesară.'], 401);
}

$db = getDB();
$chk = $db->prepare('SELECT id FROM users WHERE id = ? AND email = ?');
$chk->execute([$user_id, $user_email]);
if (!$chk->fetch()) {
    jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $after = (int)($_GET['after'] ?? 0);

    $stmt = $db->prepare(
        'SELECT id, sender, message, created_at FROM chat_messages
         WHERE user_id = ? AND id > ?
         ORDER BY created_at ASC
         LIMIT 100'
    );
    $stmt->execute([$user_id, $after]);
    $messages = $stmt->fetchAll();

    jsonResponse(['ok' => true, 'messages' => $messages]);
}

if ($method === 'POST') {
    $body    = getRequestBody();
    $message = trim($body['message'] ?? '');

    if (!$message) {
        jsonResponse(['ok' => false, 'error' => 'Mesajul nu poate fi gol.'], 422);
    }

    $stmt = $db->prepare(
        'INSERT INTO chat_messages (user_id, sender, message) VALUES (?, "user", ?)'
    );
    $stmt->execute([$user_id, $message]);
    $new_id = (int)$db->lastInsertId();

    // Fetch the inserted message to return it
    $row = $db->prepare('SELECT id, sender, message, created_at FROM chat_messages WHERE id = ?');
    $row->execute([$new_id]);

    jsonResponse(['ok' => true, 'message' => $row->fetch()], 201);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
