<?php
    include 'config.php';
    $db_o = new DB_O();
    $db_o = $db_o->get_db();

    if ($result = $db_o->query("SELECT * FROM users")) {
        $resultArray = array();
        for($i = 0; $i < $result->num_rows; $i++) {
            $row = $result->fetch_assoc();
            $resultArray[$i] = $row;
        }
        header('Content-type: application/json');
        echo json_encode($resultArray);
        mysqli_free_result($result);
    } else {
        echo 'ERROR';
        exit();
    }
    exit();
?>