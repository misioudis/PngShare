<?php
    include 'config.php';

    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    $data=json_decode(file_get_contents('php://input'),1);
    
    //Ensure proper method, 405 reponse
    if($_SERVER['REQUEST_METHOD'] != "POST") {
        header('Content-type: application/json');
        http_response_code(405);
        $body = array("status" => 405,  "message" =>"Method not allowed");
        echo json_encode($body);
        exit();
    }

    //Ensure that all mandatory fields are present and correct TODO: Make it a bit better
    if(count($data) < 3 || count($data) > 3) {
        $res = array_diff_key(array("username" => "", "password" => "", "email" => ""), $data);
        header('Content-type: application/json');
        http_response_code(400);
        $body = array("status" => 400,  "message" =>"Missing fields: ".implode(", ", array_keys($res)));
        echo json_encode($body);
        exit();
    }

    //In all else cases insert new user 
    $query_string = 
        "INSERT INTO users VALUES (UUID(), '"
        .$data['username']. "', '"
        .password_hash($data["password"], PASSWORD_BCRYPT). "', '"
        .$data["email"]. "');";

    if ($result = $db_o->query($query_string)) {
        header('Content-type: application/json');
        http_response_code(201);
        $body = array("status" => 201,  "message" =>"User created succesfully!");
        echo json_encode($body);
    } else {
        header('Content-type: application/json');
        http_response_code(500);
        $body = array("status" => 500,  "message" =>$result->error);
        echo json_encode($body);
    }
?>