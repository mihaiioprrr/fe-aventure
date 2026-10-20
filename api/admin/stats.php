<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

$headers = getallheaders();
$role = $headers['X-User-Role'] ?? '';
if ($role !== 'admin') jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);

$db = getDB();

$users        = $db->query('SELECT COUNT(*) FROM users WHERE role = "user"')->fetchColumn();
$reservations = $db->query('SELECT COUNT(*) FROM reservations')->fetchColumn();
$new_res      = $db->query('SELECT COUNT(*) FROM reservations WHERE status = "noua"')->fetchColumn();
$offers       = $db->query('SELECT COUNT(*) FROM offers')->fetchColumn();

$recent = $db->query('SELECT name, email, created_at FROM reservations ORDER BY created_at DESC LIMIT 5')->fetchAll();

jsonResponse([
    'ok'    => true,
    'stats' => [
        'users'        => (int)$users,
        'reservations' => (int)$reservations,
        'new_res'      => (int)$new_res,
        'offers'       => (int)$offers,
    ],
    'recent_reservations' => $recent,
]);
