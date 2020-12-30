<?php
    include 'config.php';
    include 'auth.php';

    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    //Get username
    $userID = json_decode(
        base64_decode(
            explode('.', explode(
                    'Bearer', getallheaders()["Authorization"]
                    )[1]
                )[1]
            , true)
    , true)["uid"];
    $username = json_decode(
        base64_decode(
            explode('.', explode(
                    'Bearer', getallheaders()["Authorization"]
                    )[1]
                )[1]
            , true)
    , true)["un"];

    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $data=json_decode(file_get_contents('php://input'),1);
        $stmt = $db_o->prepare("INSERT INTO posts VALUES (UUID() ,? ,?, ?, '[]');");
        $stmt->bind_param("sss", $userID, $data["path"], $data["title"]);
        $stmt->execute();

        rename('/png_share_data/'.$username.'/tmp/'.$data["path"], '/png_share_data/'.$username.'/'.$data["path"]);
    } elseif ($_SERVER['REQUEST_METHOD'] == "GET") {
        if(!isset($_GET["postId"])) {
            $stmt = $db_o->prepare("SELECT * FROM posts WHERE user_id = ? ;");
            $stmt->bind_param("s", $userID);
            $stmt->execute();
            $stmt->bind_result($id, $userId, $photo, $postName, $comments);

            $response = array();
            $i=0;

            while($stmt->fetch()) {
                $response[$i] = array("id" => $id, "userId" => $userId, "photo" => $photo, "postName" => $postName, "comments" => $comments); 
                $i++;
            }
            header('Content-type: application/json');
            echo json_encode($response);
        } else {

            $stmt = $db_o->prepare("SELECT * FROM posts WHERE id = ? ;");
            $stmt->bind_param("s", $_GET["postId"]);
            $stmt->execute();
            $stmt->bind_result($id, $userId, $photo, $postName, $date);
            $stmt->fetch();

            $response = array("id" => $id, "userId" => $userId, "photo" => $photo, "postName" => $postName);

            $db_o1 = new DB_O();
            $db_o1 = $db_o1->get_db();
            $stmt1 = $db_o1->prepare("SELECT * FROM comments WHERE post_id = ? ;");
            $stmt1->bind_param("s", $_GET["postId"]);
            $stmt1->execute();
            $stmt1->bind_result($cid, $cuserId, $postId, $comment);

            $commentsArray = array();
            $i=0;

            while($stmt1->fetch()) {
                $commentsArray[$i] = array("id" => $cid, "userId" => $cuserId, "post_id" => $postId, "comment" => $comment); 
                $i++;
            }
            $response["comments"] =  $commentsArray;
            header('Content-type: application/json');
            echo json_encode($response);
        }
    }

?>