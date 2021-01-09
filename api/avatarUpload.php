<?php

    include 'config.php';
    

    if ($_SERVER['REQUEST_METHOD'] !="GET")
    {
        //Get username
        $user = json_decode(
            base64_decode(
                explode('.', explode(
                        'Bearer', getallheaders()["Authorization"]
                        )[1]
                    )[1]
                , true)
            , true)["un"];
    }

    if($_SERVER['REQUEST_METHOD'] == "POST") 
    {
        include 'auth.php';
        // file name
        $filename = $_FILES['file']['name'];

        // Location
        $canonical_filename = $filename;
        $location = '/png_share_data/'.$user. '/tmp/' .$canonical_filename;

        // file extension
        $file_extension = pathinfo($location, PATHINFO_EXTENSION);
        $file_extension = strtolower($file_extension);

        // Valid image extensions
        $image_ext = array("jpg","png","jpeg","gif");

        $response = 0;
        if(in_array($file_extension,$image_ext)){
            // Upload file
            if(move_uploaded_file($_FILES['file']['tmp_name'], $location)){
                $response = $location;
            }
        }

        echo json_encode(array("code" => 200, "path" => $canonical_filename));

    }
    
    
    elseif ($_SERVER['REQUEST_METHOD'] == "PUT") 
    {
        include 'auth.php';
        $data=json_decode(file_get_contents('php://input'),1);
        $db_o = new DB_O();
        $db_o = $db_o->get_db();
        $stmt = $db_o->prepare("UPDATE users SET avatar =? WHERE id=?");
        $stmt->bind_param("ss", $_GET["uid"],$data["path"]);
        $stmt->execute();
        rename('/png_share_data/'.$user.'/tmp/'.$data["path"], '/png_share_data/'.$user.'/'.$data["path"]);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] == "DELETE") 
    {
        include 'auth.php';
        if($_GET["temp"] == "true")
            $path = '/png_share_data/' .$user. '/tmp/' . $_GET["path"];
        else
            $path = '/png_share_data/' .$user. '/' . $_GET["path"];

        unlink($path);
    }
    elseif ($_SERVER['REQUEST_METHOD'] == "GET") 
    {

        if($_GET["temp"] == "false")
            readfile('/png_share_data/'.$_GET["username"].'/'.$_GET["path"]);
        else
            readfile('/png_share_data/'.$_GET["username"].'/tmp/'.$_GET["path"]);
    }
?>