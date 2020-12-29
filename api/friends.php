<?php
    error_reporting(E_ALL ^ E_NOTICE);

    include 'config.php';
    include 'auth.php';

    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    
    if($_SERVER['REQUEST_METHOD'] == "GET") {
        if(isset($_GET["user_id"])) { // IF WE ARE SEARCHING A USER BY THEIR ID WE DON'T NEED TO USE THE EMAIL
            $stmt = $db_o->prepare("SELECT username, email FROM users WHERE id = ?;");
            $stmt->bind_param("s", $_GET["user_id"]);
            $stmt->execute();
            $stmt->bind_result($un, $email);
            $stmt->fetch();
            
            header('Content-type: application/json');
            echo json_encode(array("username" => $un, "email" => $email));

        } elseif (isset($_GET["qry"])){ // IF WE HAVE THE QUERY PARAM FOR QUERYING INFO WE JUST THAT TO LOOK FOR USERS BASED ON USERNAME AND EMAIL
            $user = json_decode(
                base64_decode(
                    explode('.', explode(
                            'Bearer', getallheaders()["Authorization"]
                            )[1]
                        )[1]
                    , true)
            , true);

            $qr = "%{$_GET['qry']}%";
            $stmt = $db_o->prepare("SELECT username, email, id FROM users WHERE username LIKE ? OR email LIKE ? ;");
            $stmt->bind_param("ss", $qr, $qr);
            $stmt->execute();
            $stmt->bind_result($un, $email, $id);

            $response = array();
            $i=0;

            while($stmt->fetch()) {
                $db_o1 = new DB_O();
                $db_o1 = $db_o1->get_db();
                
                $stmt2 = $db_o1->prepare("SELECT state FROM friends WHERE (user_id = '".$user['uid']."' AND friend_user_id = '" .$id. "') OR (friend_user_id = '".$user['uid']."' AND user_id = '" .$id. "');");
                $stmt2->execute();
                $stmt2->bind_result($state);
                $stmt2->fetch();
                $response[$i] = array("username" => $un, "email" => $email, "id" => $id, "state" => $state); 
                $i++;
            }

            header('Content-type: application/json');
            echo json_encode($response);
        } else {
            // THIS IS LOADED WHEN A USERS ENTERS THE FRIENDS PAGE
            //GET EMAIL
            $headers = getallheaders();
            $jwt = explode(" ", $headers["Authorization"])[1];
            $id = json_decode(base64_decode(explode('.', $jwt)[1]), true)["uid"];

            $stmt = $db_o->prepare("SELECT friend_user_id, state, user_id FROM friends WHERE (user_id = ? OR friend_user_id = ?) AND state >= 0;");
            $stmt->bind_param("ss", $id, $id);
            $stmt->execute();
            $stmt->bind_result($frnd_list, $frnd_state, $user_id);
            
            $response = array();
            $i = 0;
            while($stmt->fetch()) {
                $db_o1 = new DB_O();
                $db_o1 = $db_o1->get_db();
                $stmt2 = $db_o1->prepare("SELECT username, email FROM users WHERE id = ?;");
                $stmt2->bind_param("s", $frnd_list);
                $stmt2->execute();
                $stmt2->bind_result($fun, $femail);
                $stmt2->fetch();

                $response[$i++] = array("username" => $fun, "email" => $femail, "state" =>$frnd_state, "user_id" => $user_id);
                
            }
            header('Content-type: application/json');
            echo json_encode($response);
        }


    } elseif ($_SERVER['REQUEST_METHOD'] == "POST") {
        $user = json_decode(
            base64_decode(
                explode('.', explode(
                        'Bearer', getallheaders()["Authorization"]
                        )[1]
                    )[1]
                , true)
        , true);
        $data=json_decode(file_get_contents('php://input'),1);

        if($user["uid"] == $data["friend"]) {
            header('Content-type: application/json');
            http_response_code(403);
            $body = array("status" => 403,  "message" =>"Cannot send a friend request to Yourself");
            echo utf8_encode(json_encode($body));
            exit();
        }

        $stmt = $db_o->prepare("INSERT INTO friends VALUES (?, ?, 0);");
        $stmt->bind_param("ss", $user["uid"], $data["friend"]);
        $stmt->execute();

        header('Content-type: application/json');
        echo json_encode(array("code" => 200, "message" => "Request sent"));

    } elseif ($_SERVER['REQUEST_METHOD'] == "PUT") {
        $user = json_decode(
            base64_decode(
                explode('.', explode(
                        'Bearer', getallheaders()["Authorization"]
                        )[1]
                    )[1]
                , true)
        , true);
        $data=json_decode(file_get_contents('php://input'),1);

        if($user["uid"] == $data["friend"]) {
            header('Content-type: application/json');
            http_response_code(403);
            $body = array("status" => 403,  "message" =>"Cannot accept your own friend request!");
            echo utf8_encode(json_encode($body));
            exit();
        }

        if($data["accepted"] == true) {
            $stmt = $db_o->prepare("UPDATE friends SET state = 1 WHERE (user_id = ? AND friend_user_id = ?) OR (friend_user_id = ? AND user_id = ?);");
            $stmt->bind_param("ssss", $data["friend"], $user["uid"], $data["friend"], $user["uid"]);
            $stmt->execute();

            header('Content-type: application/json');
            echo json_encode(array("code" => 200, "message" => "Friend accepted"));
        } else {
            $stmt = $db_o->prepare("DELETE FROM friends WHERE (user_id = ? AND friend_user_id = ? AND state = 0) OR (friend_user_id = ? AND user_id = ? AND state = 0);");
            $stmt->bind_param("ss", $user["uid"], $data["friend"]);
            $stmt->execute();

            header('Content-type: application/json');
            echo json_encode(array("code" => 200, "message" => "Request Deleted"));
        }
    }
?>