<?php
require_once __DIR__ . '/config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['ok' => false, 'error' => 'Metodă nepermisă.'], 405);
}

$body = getRequestBody();

$name      = trim($body['name'] ?? '');
$email     = trim($body['email'] ?? '');
$password  = $body['password'] ?? '';
$birthdate = $body['birthdate'] ?? '';

if (!$name || !$email || !$password || !$birthdate) {
    jsonResponse(['ok' => false, 'error' => 'Toate câmpurile sunt obligatorii.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['ok' => false, 'error' => 'Adresa de email nu este validă.'], 422);
}

if (strlen($password) < 6) {
    jsonResponse(['ok' => false, 'error' => 'Parola trebuie să aibă cel puțin 6 caractere.'], 422);
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthdate)) {
    jsonResponse(['ok' => false, 'error' => 'Data nașterii nu este validă.'], 422);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['ok' => false, 'error' => 'Există deja un cont cu această adresă de email.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $db->prepare('INSERT INTO users (name, email, password, birthdate) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $hash, $birthdate]);
    $userId = (int) $db->lastInsertId();

    jsonResponse([
        'ok'   => true,
        'user' => ['id' => $userId, 'email' => $email, 'name' => $name, 'role' => 'user'],
    ], 201);

} catch (PDOException $e) {
    jsonResponse(['ok' => false, 'error' => 'Eroare de server. Încearcă din nou.'], 500);
}
