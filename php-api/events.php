<?php
require_once __DIR__ . '/cors.php';
    ini_set('display_errors', 1);
error_reporting(E_ALL);
// events.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$input = get_json_input();

// Simple router by path
// Endpoints:
// POST   /events            -> create
// GET    /events            -> list (filter ?city=...)
// PUT    /events/{id}       -> update
// DELETE /events/{id}       -> delete
// PATCH  /events/{id}/approve -> approve/reject (admin)

if ($method === 'OPTIONS') { http_response_code(200); exit; }

// GET /events
if ($method === 'GET' && strpos($path, '/events') !== false) {
    $user = auth_user(); // Ab yeh null bhi return kar sakta hai → safe!

    $params = [];
    $sql = "SELECT 
                e.id, e.title, e.description, e.date, e.location, 
                e.approved, u.name as creatorName
            FROM events e
            LEFT JOIN users u ON e.createdBy = u.id";

    $where = [];

    // Sirf resident ko apne events dikhao
    if ($user && $user['role'] === 'resident') {
        $where[] = "e.createdBy = ?";
        $params[] = $user['id'];
    }
    // Admin ko sab dikhega
    // Guest (no token) ko sab dikhega

    if (!empty($where)) {
        $sql .= " WHERE " . implode(' AND ', $where);
    }

    $sql .= " ORDER BY e.date DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

   
    unset($event);

    json_response($events);
}


// POST /events
if ($method === 'POST' && strpos($path, '/events') !== false) {
    $user = auth_user(); 
    if ($user['role'] === 'admin') {
        json_response(['error' => 'Admin cannot create events'], 403);
    }

    $title       = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $date        = $input['date'] ?? null;        // ISO format expected
    $location    = trim($input['location'] ?? '');

    if (!$title || !$date) {
        json_response(['error' => 'Title and date are required'], 422);
    }

    // Insert event
    $stmt = $pdo->prepare('
        INSERT INTO events (title, description, date, location, createdBy, approved) 
        VALUES (?, ?, ?, ?, ?, 0)
    ');
    $stmt->execute([$title, $description, $date, $location, $user['id']]);
    $eventId = $pdo->lastInsertId();

    $stmt = $pdo->prepare('
        SELECT e.*, u.name as creatorName 
        FROM events e 
        JOIN users u ON e.createdBy = u.id 
        WHERE e.id = ?
    ');
    $stmt->execute([$eventId]);
    $newEvent = $stmt->fetch(PDO::FETCH_ASSOC);

    unset(
        $newEvent['createdBy'],
    $newEvent['created_at']
    ); 

    json_response([
        'message' => 'Event created successfully',
        'event'   => $newEvent
    ], 201);
}

// PUT /events/{id}
if ($method === 'PUT' && preg_match('#/events/(\d+)#', $path, $m)) {
    $eventId = intval($m[1]);
    $user = auth_user();

    // check owner or admin
    $stmt = $pdo->prepare('SELECT * FROM events WHERE id = ?');
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    if (!$event) json_response(['error' => 'Event not found'], 404);

    if ($user['role'] !== 'admin' && $event['createdBy'] != $user['id']) {
        json_response(['error' => 'Access denied'], 403);
    }

    $title = trim($input['title'] ?? $event['title']);
    $description = trim($input['description'] ?? $event['description']);
    $date = $input['date'] ?? $event['date'];
    $location = trim($input['location'] ?? $event['location']);

    $stmt = $pdo->prepare('UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE id = ?');
    $stmt->execute([$title, $description, $date, $location, $eventId]);
    json_response(['message' => 'Event updated']);
}

// DELETE /events/{id}
if ($method === 'DELETE' && preg_match('#/events/(\d+)#', $path, $m)) {
    $eventId = intval($m[1]);
    $user = auth_user();

    $stmt = $pdo->prepare('SELECT * FROM events WHERE id = ?');
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    if (!$event) json_response(['error' => 'Event not found'], 404);

    if ($user['role'] !== 'admin' && $event['createdBy'] != $user['id']) {
        json_response(['error' => 'Access denied'], 403);
    }

    $stmt = $pdo->prepare('DELETE FROM events WHERE id = ?');
    $stmt->execute([$eventId]);
    json_response(['message' => 'Event deleted', 'event' => $event]);
}

// PATCH /events/{id}/approve
if ($method === 'PATCH' && preg_match('#/events/(\d+)/approve#', $path, $m)) {
    $eventId = intval($m[1]);
    $user = auth_user();
    if ($user['role'] !== 'admin') {
        json_response(['error' => 'Admin only'], 403);
    }
    // expect body { approved: true/false }
    $approved = isset($input['approved']) && ($input['approved'] == true || $input['approved'] == 1) ? 1 : 0;
    $stmt = $pdo->prepare('UPDATE events SET approved = ? WHERE id = ?');
    $stmt->execute([$approved, $eventId]);
    json_response(['message' => 'Updated approval', 'approved' => (bool)$approved,'ApprovedEventID' => $eventId]);
}

json_response(['error' => 'Not Found'], 404);
