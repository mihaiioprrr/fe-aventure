<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

$headers = getallheaders();
$role = $headers['X-User-Role'] ?? '';
if ($role !== 'admin') jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query('SELECT * FROM offers ORDER BY created_at DESC');
    jsonResponse(['ok' => true, 'offers' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $b = getRequestBody();
    $required = ['slug','title','category','destination','price_ron'];
    foreach ($required as $f) {
        if (empty($b[$f])) jsonResponse(['ok' => false, 'error' => "Câmpul '$f' este obligatoriu."], 422);
    }
    $stmt = $db->prepare('
        INSERT INTO offers (slug,title,subtitle,category,destination,country,duration_days,duration_nights,
            price_ron,image_url,short_desc,full_desc,difficulty,transport,accommodation,featured)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ');
    $stmt->execute([
        $b['slug'], $b['title'], $b['subtitle'] ?? '', $b['category'], $b['destination'],
        $b['country'] ?? '', (int)($b['duration_days'] ?? 1), (int)($b['duration_nights'] ?? 0),
        (int)$b['price_ron'], $b['image_url'] ?? '', $b['short_desc'] ?? '', $b['full_desc'] ?? '',
        $b['difficulty'] ?? 'Ușor', $b['transport'] ?? '', $b['accommodation'] ?? '',
        (int)($b['featured'] ?? 0),
    ]);
    jsonResponse(['ok' => true, 'id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'PATCH') {
    $b = getRequestBody();
    $id = (int)($b['id'] ?? 0);
    if (!$id) jsonResponse(['ok' => false, 'error' => 'ID invalid.'], 422);
    $stmt = $db->prepare('
        UPDATE offers SET
            slug=?, title=?, subtitle=?, category=?, destination=?, country=?,
            duration_days=?, duration_nights=?, price_ron=?, image_url=?,
            short_desc=?, full_desc=?, difficulty=?, transport=?, accommodation=?, featured=?
        WHERE id=?
    ');
    $stmt->execute([
        $b['slug'] ?? '', $b['title'] ?? '', $b['subtitle'] ?? '',
        $b['category'] ?? '', $b['destination'] ?? '', $b['country'] ?? '',
        (int)($b['duration_days'] ?? 1), (int)($b['duration_nights'] ?? 0),
        (int)($b['price_ron'] ?? 0), $b['image_url'] ?? '',
        $b['short_desc'] ?? '', $b['full_desc'] ?? '',
        $b['difficulty'] ?? 'Ușor', $b['transport'] ?? '', $b['accommodation'] ?? '',
        (int)($b['featured'] ?? 0), $id,
    ]);
    jsonResponse(['ok' => true]);
}

if ($method === 'DELETE') {
    $b = getRequestBody();
    $id = (int)($b['id'] ?? 0);
    if (!$id) jsonResponse(['ok' => false, 'error' => 'ID invalid.'], 422);
    $db->prepare('DELETE FROM offers WHERE id = ?')->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
