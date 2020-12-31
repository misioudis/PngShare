<?php
    require_once __DIR__ .'/vendor/autoload.php';
    require_once 'config.php';
    use \Firebase\JWT\JWT;

    $key = $key = "ftzvC3n*65(dC)<AL/\&UCb3#(Q_`Q";

    $db_o = new DB_O();
    $db_o = $db_o->get_db();

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
        $uid = json_decode(base64_decode(explode('.', $jwt)[1]), true)["uid"];

        try {
            $stmt = $db_o->prepare("SELECT jwt_key FROM users WHERE id = ?;");
            $stmt->bind_param("s", $uid);
            $stmt->execute();
            $stmt->bind_result($jwt_key);
            $stmt->fetch();

            $decoded = JWT::decode($jwt, $jwt_key, array($alg));
        } catch(Exception $e) {
            header('Content-type: application/json');
            http_response_code(401);
            $body = array("status" => 401,  "message" => $e->getMessage());
            echo utf8_encode(json_encode($body));
            exit();
        }
    }
?>