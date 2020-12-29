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
        }
    }

?>