<?php
    class DB_O {
        private $db_host = "localhost";
        private $db_user = "root";
        private $db_password = "";
        private $db_name = "png_share";

        public function get_db() {

            $mysqli_o = new mysqli(
                $this->db_host, 
                $this->db_user, 
                $this->db_password, 
                $this->db_name
            );

            if ($mysqli_o->connect_errno) {
                echo "Failed to connect to MySQL: " . $mysqli_o->connect_error;
                exit();
            } else {
                return $mysqli_o;
            }
        }
    }
?>