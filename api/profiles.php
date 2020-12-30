<?php
    error_reporting(E_ALL ^ E_NOTICE);

    include 'config.php';
    include 'auth.php';

    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    $response = array();
    $userID = json_decode(
        base64_decode(
            explode('.', explode(
                    'Bearer', getallheaders()["Authorization"]
                    )[1]
                )[1]
            , true)
    , true)["uid"];

    if(isset($_GET["userId"])) {
        //first make sure the two users are friends and can see eachther's stuff
        $db_o2 = new DB_O();
        $db_o2 = $db_o2->get_db();
        $stmt2 = $db_o2->prepare("SELECT * FROM friends WHERE (user_id = ? AND friend_user_id = ? AND state = 1) or (friend_user_id = ? AND user_id = ? AND state = 1);");
        $stmt2->bind_param("ssss", $userID, $_GET["userId"], $userID, $_GET["userId"]);
        $stmt2->execute();
        $stmt2->bind_result($uid, $fuid, $st);
        $stmt2->fetch();

        if(($uid && $fuid && $st) == 0) {
            header('Content-Type: application/json');
            http_response_code(403);
            die(json_encode(array("code" => 403, "message" => "User is not friend")));
        }

        //Else just continue with the requests
        $stmt = $db_o->prepare("SELECT username, avatar FROM users WHERE id = ?;");
        $stmt->bind_param("s", $_GET["userId"]);

        $stmt->execute();
        $stmt->bind_result($username, $avatar);
        $stmt->fetch();

        $response["userId"] = $_GET["userId"];
        $response["username"] = $username;
        $response["avatar"] = $avatar;

        $db_o1 = new DB_O();
        $db_o1 = $db_o1->get_db();
        $stmt1 = $db_o1->prepare("SELECT * FROM posts WHERE user_id = ?;");
        $stmt1->bind_param("s", $_GET["userId"]);
        $stmt1->execute();
        $stmt1->bind_result($pid, $uid, $photo, $post_name, $comments);
        
        $i = 0;
        $reponse["posts"] = array();
        while($stmt1->fetch()) {
            $response["posts"][$i++] = array("id" => $pid, "userId" => $uid, "photo" => $photo, "postName" => $post_name, "comments" => $comments);
        }

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        header('Content-Type: application/json');
        http_response_code(400);
        die(json_encode(array("code" => 400, "message" => "Missing param: userId")));
    }
?>