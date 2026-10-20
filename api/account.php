<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
}

$body = getRequestBody();
$id   = (int)($body['id'] ?? 0);
if (!$id) jsonResponse(['ok' => false, 'error' => 'ID utilizator lipsă.'], 422);

// Verify the request comes from the account owner (basic check via header)
$headers   = getallheaders();
$header_id = (int)($headers['X-User-Id'] ?? 0);
if ($header_id !== $id) {
    jsonResponse(['ok' => false, 'error' => 'Acces interzis.'], 403);
}

$db = getDB();

// ── Fetch current user ──────────────────────────────────────────────
$stmt = $db->prepare('SELECT id, name, email, phone FROM users WHERE id = ?');
$stmt->execute([$id]);
$current = $stmt->fetch();
if (!$current) jsonResponse(['ok' => false, 'error' => 'Userul nu există.'], 404);

// ── Collect fields to update ────────────────────────────────────────
$name  = trim($body['name']  ?? $current['name']);
$email = trim($body['email'] ?? $current['email']);
$phone = trim($body['phone'] ?? $current['phone'] ?? '');

if (!$name)  jsonResponse(['ok' => false, 'error' => 'Numele nu poate fi gol.'], 422);
if (!$email) jsonResponse(['ok' => false, 'error' => 'Email-ul nu poate fi gol.'], 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['ok' => false, 'error' => 'Adresa de email nu este validă.'], 422);
}

// Check email uniqueness (ignore own email)
if ($email !== $current['email']) {
    $chk = $db->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
    $chk->execute([$email, $id]);
    if ($chk->fetch()) {
        jsonResponse(['ok' => false, 'error' => 'Adresa de email este deja folosită de alt cont.'], 409);
    }
}

// ── Password change (optional) ──────────────────────────────────────
$newPassword = $body['new_password'] ?? '';
$curPassword = $body['current_password'] ?? '';

if ($newPassword !== '') {
    if (strlen($newPassword) < 6) {
        jsonResponse(['ok' => false, 'error' => 'Parola nouă trebuie să aibă cel puțin 6 caractere.'], 422);
    }
    // Verify current password
    $pwStmt = $db->prepare('SELECT password FROM users WHERE id = ?');
    $pwStmt->execute([$id]);
    $row = $pwStmt->fetch();
    if (!$row || !password_verify($curPassword, $row['password'])) {
        jsonResponse(['ok' => false, 'error' => 'Parola curentă este incorectă.'], 401);
    }
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    $db->prepare('UPDATE users SET name=?, email=?, phone=?, password=? WHERE id=?')
       ->execute([$name, $email, $phone, $hash, $id]);
} else {
    $db->prepare('UPDATE users SET name=?, email=?, phone=? WHERE id=?')
       ->execute([$name, $email, $phone, $id]);
}

// Re-fetch updated user (without password)
$stmt = $db->prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?');
$stmt->execute([$id]);
$updated = $stmt->fetch();

jsonResponse(['ok' => true, 'user' => $updated]);
