<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

$headers = getallheaders();
if (($headers['X-User-Role'] ?? '') !== 'admin') {
    jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
}

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET /admin/chat.php            → list all conversations (last message + user info)
// ── GET /admin/chat.php?user_id=X  → full thread for user X
if ($method === 'GET') {
    $uid = (int)($_GET['user_id'] ?? 0);

    if ($uid) {
        // Full thread
        $stmt = $db->prepare(
            'SELECT id, sender, message, created_at FROM chat_messages
             WHERE user_id = ? ORDER BY created_at ASC'
        );
        $stmt->execute([$uid]);
        $messages = $stmt->fetchAll();

        // User info
        $u = $db->prepare('SELECT id, name, email FROM users WHERE id = ?');
        $u->execute([$uid]);
        $user = $u->fetch();

        jsonResponse(['ok' => true, 'messages' => $messages, 'user' => $user]);
    } else {
        // All conversations: one row per user, most recent message
        $stmt = $db->query(
            'SELECT
                cm.user_id,
                u.name  AS user_name,
                u.email AS user_email,
                cm.message AS last_message,
                cm.sender  AS last_sender,
                cm.created_at AS last_at,
                (SELECT COUNT(*) FROM chat_messages
                 WHERE user_id = cm.user_id AND sender = "user"
                   AND id > COALESCE(
                     (SELECT MAX(id) FROM chat_messages
                      WHERE user_id = cm.user_id AND sender = "admin"), 0
                   )
                ) AS unread_count
             FROM chat_messages cm
             JOIN users u ON u.id = cm.user_id
             WHERE cm.id = (
                 SELECT MAX(id) FROM chat_messages WHERE user_id = cm.user_id
             )
             ORDER BY cm.created_at DESC'
        );
        jsonResponse(['ok' => true, 'conversations' => $stmt->fetchAll()]);
    }
}

// ── POST: admin replies to a user
if ($method === 'POST') {
    $b       = getRequestBody();
    $uid     = (int)($b['user_id'] ?? 0);
    $message = trim($b['message'] ?? '');

    if (!$uid || !$message) {
        jsonResponse(['ok' => false, 'error' => 'Date invalide.'], 422);
    }

    $stmt = $db->prepare(
        'INSERT INTO chat_messages (user_id, sender, message) VALUES (?, "admin", ?)'
    );
    $stmt->execute([$uid, $message]);
    $new_id = (int)$db->lastInsertId();

    $row = $db->prepare('SELECT id, sender, message, created_at FROM chat_messages WHERE id = ?');
    $row->execute([$new_id]);

    jsonResponse(['ok' => true, 'message' => $row->fetch()], 201);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
