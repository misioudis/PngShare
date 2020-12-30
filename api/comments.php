<?php
    error_reporting(E_ALL ^ E_NOTICE);

    include 'config.php';
    include 'auth.php';

    $db_o = new DB_O();
    $db_o = $db_o->get_db();
    
    if($_SERVER['REQUEST_METHOD'] == "GET") { //get comment info from sql
        $commentid = $_GET["commentId"];
        $stmt = $db_o->prepare("SELECT * FROM comments WHERE id = ?;");
        $stmt->bind_param("s", $commentid);
        $stmt->execute();
        $stmt->bind_result($id, $user_id, $post_id, $comment);
        $stmt->fetch();

        $db_o1 = new DB_O();
        $db_o1 = $db_o1->get_db();
        $stmt1 = $db_o1->prepare("SELECT username FROM users WHERE id = ?;");
        $stmt1->bind_param("s", $user_id);
        $stmt1->execute();
        $stmt1->bind_result($un);
        $stmt1->fetch();
            
        header('Content-type: application/json');
        echo json_encode(array("id" => $id, "userId" => $user_id, "postId" => $post_id, "comment" => $comment, "username" => $un));
    }
    elseif($_SERVER['REQUEST_METHOD'] == "POST") { //insert new comment to sql
        $data=json_decode(file_get_contents('php://input'),1);

        $stmt = $db_o->prepare("SELECT UUID();");
        $stmt->execute();
        $stmt->bind_result($uuid);
        $stmt->fetch();
            
        $db_o1 = new DB_O();
        $db_o1 = $db_o1->get_db();
        $stmt1 = $db_o1->prepare("INSERT INTO comments VALUES (?, ?, ?, ?);");
        $stmt1->bind_param("ssss", $uuid, $data["userId"], $data["postId"], $data["comment"]);
        $stmt1->execute();

        header('Content-type: application/json');
        echo json_encode(array("code" => 200, "message" => "Request sent"));
    }
?>