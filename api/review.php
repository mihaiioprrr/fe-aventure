<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: fetch approved reviews (public) ──────────────────────────
if ($method === 'GET') {
    $stmt = $db->query(
        'SELECT r.id, r.rating, r.body, r.offer_id, r.created_at,
                u.name AS user_name
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.approved = 1
         ORDER BY r.created_at DESC
         LIMIT 20'
    );
    jsonResponse(['ok' => true, 'reviews' => $stmt->fetchAll()]);
}

// ── POST: submit a review (must be logged in) ─────────────────────
if ($method === 'POST') {
    $headers  = getallheaders();
    $user_id  = (int)($headers['X-User-Id'] ?? 0);
    $user_email = trim($headers['X-User-Email'] ?? '');

    if (!$user_id || !$user_email) {
        jsonResponse(['ok' => false, 'error' => 'Autentificare necesară.'], 401);
    }

    // Verify user
    $chk = $db->prepare('SELECT id FROM users WHERE id = ? AND email = ?');
    $chk->execute([$user_id, $user_email]);
    if (!$chk->fetch()) {
        jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
    }

    $b      = getRequestBody();
    $rating = (int)($b['rating'] ?? 0);
    $body   = trim($b['body'] ?? '');
    $offer  = trim($b['offer_id'] ?? '');

    if ($rating < 1 || $rating > 5) {
        jsonResponse(['ok' => false, 'error' => 'Rating invalid (1–5).'], 422);
    }
    if (!$body) {
        jsonResponse(['ok' => false, 'error' => 'Recenzia nu poate fi goală.'], 422);
    }

    $stmt = $db->prepare(
        'INSERT INTO reviews (user_id, rating, body, offer_id, approved) VALUES (?, ?, ?, ?, 0)'
    );
    $stmt->execute([$user_id, $rating, $body, $offer]);

    jsonResponse(['ok' => true], 201);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
