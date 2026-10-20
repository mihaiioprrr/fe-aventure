<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

$headers = getallheaders();
if (($headers['X-User-Role'] ?? '') !== 'admin') {
    jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
}

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: all reviews ─────────────────────────────────────────────
if ($method === 'GET') {
    $stmt = $db->query(
        'SELECT r.id, r.rating, r.body, r.offer_id, r.approved, r.created_at,
                u.name AS user_name, u.email AS user_email
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         ORDER BY r.created_at DESC'
    );
    jsonResponse(['ok' => true, 'reviews' => $stmt->fetchAll()]);
}

// ── PATCH: approve / unapprove ───────────────────────────────────
if ($method === 'PATCH') {
    $b        = getRequestBody();
    $id       = (int)($b['id'] ?? 0);
    $approved = isset($b['approved']) ? (int)(bool)$b['approved'] : -1;

    if (!$id || $approved === -1) {
        jsonResponse(['ok' => false, 'error' => 'Date invalide.'], 422);
    }

    $db->prepare('UPDATE reviews SET approved = ? WHERE id = ?')->execute([$approved, $id]);
    jsonResponse(['ok' => true]);
}

// ── DELETE ───────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $b  = getRequestBody();
    $id = (int)($b['id'] ?? 0);
    if (!$id) jsonResponse(['ok' => false, 'error' => 'ID invalid.'], 422);
    $db->prepare('DELETE FROM reviews WHERE id = ?')->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
