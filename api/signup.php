<?php
    include 'config.php';
    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    $data=json_decode(file_get_contents('php://input'),1);
    $query_string = 
        "INSERT INTO users VALUES (UUID(), '"
        .$data['username']. "', '"
        .password_hash($data["password"], PASSWORD_BCRYPT). "', '"
        .$data["email"]. "');";

    if ($result = $db_o->query($query_string)) {
        header('Content-type: application/json');
        http_response_code(201);
        $body = array("status" => 201,  "message" =>"user created succesfully");
        echo json_encode($body);
    } else {
        header('Content-type: application/json');
        http_response_code(400);
        $body = array("status" => 400,  "message" =>"Something you sent was wrong");
        echo json_encode($body);
    }
?>