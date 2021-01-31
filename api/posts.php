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
        $stmt = $db_o->prepare("INSERT INTO posts VALUES (UUID() ,? ,?, ?, CURRENT_TIMESTAMP);");
        $stmt->bind_param("sss", $userID, $data["path"], $data["title"]);
        $stmt->execute();

        rename('/png_share_data/'.$username.'/tmp/'.$data["path"], '/png_share_data/'.$username.'/'.$data["path"]);
    } elseif ($_SERVER['REQUEST_METHOD'] == "GET") {
        if(isset($_GET["postId"])) {
            $stmt = $db_o->prepare("SELECT * FROM posts WHERE id = ? ;");
            $stmt->bind_param("s", $_GET["postId"]);
            $stmt->execute();
            $stmt->bind_result($id, $userId, $photo, $postName, $date);
            $stmt->fetch();

            $response = array("id" => $id, "userId" => $userId, "photo" => $photo, "postName" => $postName, "date" => $date);

            $db_o1 = new DB_O();
            $db_o1 = $db_o1->get_db();
            $stmt1 = $db_o1->prepare("SELECT * FROM comments WHERE post_id = ? ;");
            $stmt1->bind_param("s", $_GET["postId"]);
            $stmt1->execute();
            $stmt1->bind_result($cid, $cuserId, $postId, $comment, $date);

            $commentsArray = array();
            $i=0;

            while($stmt1->fetch()) {
                $db_o2 = new DB_O();
                $db_o2 = $db_o2->get_db();
                $stmt2 = $db_o2->prepare("SELECT username FROM users WHERE id = ? ;");
                $stmt2->bind_param("s", $cuserId);
                $stmt2->execute();
                $stmt2->bind_result($un);
                $stmt2->fetch();

                $commentsArray[$i] = array("id" => $cid, "userId" => $cuserId, "post_id" => $postId, "comment" => $comment, "date" => $date, "username" => $un); 
                $i++;
            }
            $response["comments"] =  $commentsArray;
            header('Content-type: application/json');
            echo json_encode($response);
        } elseif (isset($_GET["userId"])) {
            ////////// 
            // IN CASE userID is given as query param
            //////////
            $stmt = $db_o->prepare("SELECT * FROM posts WHERE user_id = ? ;");
            $stmt->bind_param("s", $_GET["userId"]);
            $stmt->execute();
            $stmt->bind_result($id, $userId, $photo, $postName, $date);
            
            $db_o1 = new DB_O();
            $db_o1 = $db_o1->get_db();
            $stmt1 = $db_o1->prepare("SELECT username FROM users WHERE id = ? ;");
            $stmt1->bind_param("s", $_GET["userId"]);
            $stmt1->execute();
            $stmt1->bind_result($un);
            $stmt1->fetch();

            $response = array();
            $i=0;
            while($stmt->fetch()) {
                $response[$i++] = array("postId" => $id, "userId" => $userId, "username" => $un, "photo" => $photo, "postName" => $postName, "date" => $date);
            }

            header('Content-type: application/json');
            echo json_encode($response);
         } else {
             ////////// 
            // IN CASE NO POST ID WE RETRIEVE THE POSTS OF REQUESTER USER
            ////////// 
            $stmt = $db_o->prepare("SELECT * FROM posts WHERE user_id = ? ;");
            $stmt->bind_param("s", $userID);
            $stmt->execute();
            $stmt->bind_result($id, $userId, $photo, $postName, $date);

            $response = array();
            $i=0;

            while($stmt->fetch()) {
                $response[$i] = array("id" => $id, "userId" => $userId, "photo" => $photo, "postName" => $postName, "date" => $date); 
                $i++;
            }
            header('Content-type: application/json');
            echo json_encode($response);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] == "DELETE") {
        $stmt = $db_o->prepare("SELECT photo FROM posts WHERE id = ? ;");
        $stmt->bind_param("s", $_GET["postId"]);
        $stmt->execute();
        $stmt->bind_result($photo);
        $stmt->fetch();

        $db_o1 = new DB_O();
        $db_o1 = $db_o1->get_db();
        $stmt1 = $db_o1->prepare("DELETE FROM posts WHERE id = ? ;");
        $stmt1->bind_param("s", $_GET["postId"]);
        $stmt1->execute();

        $path = '/png_share_data/' .$username. '/' .$photo;
        unlink($path);
        
        header('Content-type: application/json');
        echo json_encode(array("code" => 200, "message" => "Post deleted!"));
    }

?>
