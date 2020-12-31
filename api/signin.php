<?php
    error_reporting(E_ALL ^ E_NOTICE);

    require_once __DIR__ .'/vendor/autoload.php';
    require_once 'config.php';
    use \Firebase\JWT\JWT;

    $key = "ftzvC3n*65(dC)<AL/\&UCb3#(Q_`Q"; // key for the JWT tokens

    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    $data=json_decode(file_get_contents('php://input'),1);

    if($_SERVER['REQUEST_METHOD'] != "POST") {
        header('Content-type: application/json');
        http_response_code(405);
        $body = array("status" => 405,  "message" =>"Method not allowed");
        echo utf8_encode(json_encode($body));
        exit();
    }

    //Ensure that all mandatory fields are present and correct TODO: Make it a bit better
    if(count($data) < 2 || count($data) > 2) {
        $res = array_diff_key(array("email" => "", "password" => ""), $data);
        header('Content-type: application/json');
        http_response_code(400);
        $body = array("status" => 400,  "message" =>"Missing fields: ".implode(", ", array_keys($res)));
        echo utf8_encode(json_encode($body));
        exit();
    }

    $stmt = $db_o->prepare("SELECT id, password, username FROM users WHERE email = ?;");
    $stmt->bind_param("s", $email);
    $email = $data["email"];
    $stmt->execute();
    $stmt->bind_result($id, $result, $un);
    $stmt->fetch();
    

    if($result == '') {
        header('Content-type: application/json');
        http_response_code(401);
        $body = array("status" => 401,  "message" => "Invalid Password!");
        echo utf8_encode(json_encode($body));
        exit();
    }
    $verified = password_verify($data["password"], $result);
    if($verified) {
        $payload = array(
            "iss" => "http://trojanzaro.ddns.net/",
            "aud" => $data["email"],
            "uid" => $id,
            "un" => $un,
            "iat" => time()
        );
        $jwt_key = JWT::encode($payload, $key);

        $db_o1 = new DB_O();
        $db_o1 = $db_o1->get_db();

        $stmt1 = $db_o1->prepare("UPDATE users SET jwt_key = ? WHERE id = ?;");
        $stmt1->bind_param("ss", $jwt_key, $id);
        $stmt1->execute();

        $payload2 = array(
            "iss" => "http://trojanzaro.ddns.net/",
            "aud" => $data["email"],
            "uid" => $id,
            "un" => $un,
            "iat" => time()
        );
        $jwt = JWT::encode($payload2, $jwt_key);

        header('Content-type: application/json');
        echo utf8_encode(json_encode(array("status" => 200, "email" => $data["email"], "token" => $jwt)));

    } else {
        header('Content-type: application/json');
        http_response_code(401);
        $body = array("status" => 401,  "message" =>"Invalid Password!");
        echo utf8_encode(json_encode($body));
        exit();
    }
?>