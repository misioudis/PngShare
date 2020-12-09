<?php
    require_once __DIR__ .'/vendor/autoload.php';
    use \Firebase\JWT\JWT;

    $key = $key = "ftzvC3n*65(dC)<AL/\&UCb3#(Q_`Q";

    $headers = getallheaders();
    if(!isset($headers["Authorization"])) {
        header('Content-type: application/json');
        http_response_code(401);
        $body = array("status" => 401,  "message" => "Unauthorized");
        echo utf8_encode(json_encode($body));
        exit();
    } else {
        //extract the token from the Authorization Header
        $jwt = explode(" ", $headers["Authorization"])[1];
        $alg = json_decode(base64_decode(explode('.', $jwt)[0]), true)["alg"];
        try {
            $decoded = JWT::decode($jwt, $key, array($alg));
        } catch(Exception $e) {
            header('Content-type: application/json');
            http_response_code(401);
            $body = array("status" => 401,  "message" => $e->getMessage());
            echo utf8_encode(json_encode($body));
            exit();
        }
    }
?>