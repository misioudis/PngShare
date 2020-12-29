<?php
    include 'config.php';

    if($_SERVER['REQUEST_METHOD'] == "POST") {

        include 'auth.php';

        //Get username
        $user = json_decode(
            base64_decode(
                explode('.', explode(
                        'Bearer', getallheaders()["Authorization"]
                        )[1]
                    )[1]
                , true)
        , true)["un"];

        // file name
        $filename = $_FILES['file']['name'];

        // Location
        $canonical_filename = time(). '_' .$filename;
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

    } elseif ($_SERVER['REQUEST_METHOD'] == "GET"){
        $db_o = new DB_O();
        $db_o = $db_o->get_db();
        $stmt = $db_o->prepare("SELECT username FROM users WHERE id = ?;");
        $stmt->bind_param("s", $_GET["uid"]);
        $stmt->execute();
        $stmt->bind_result($un);
        $stmt->fetch();
        if($_GET["temp"] == "false")
            readfile('/png_share_data/'.$un.'/'.$_GET["path"]);
        else
            readfile('/png_share_data/'.$un.'/tmp/'.$_GET["path"]);
    } elseif ($_SERVER['REQUEST_METHOD'] == "DELETE") {

        include 'auth.php';

        //Get username
        $user = json_decode(
            base64_decode(
                explode('.', explode(
                        'Bearer', getallheaders()["Authorization"]
                        )[1]
                    )[1]
                , true)
        , true)["un"];

        if($_GET["temp"] == "true")
            $path = '/png_share_data/' .$user. '/tmp/' . $_GET["path"];
        else
            $path = '/png_share_data/' .$user. '/' . $_GET["path"];

        unlink($path);
    }
?>