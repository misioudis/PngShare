<?php
    if(!is_dir('/png_share_data')) {
        mkdir('/png_share_data');
        // Initialize a file URL to the variable 
        $url = 'https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png'; 
        $ch = curl_init($url); 
        $dir = '/png_share_data'; 
        $file_name = basename($url); 
        $save_file_loc = $dir . '/default.png'; 
        $fp = fopen($save_file_loc, 'wb'); 
        curl_setopt($ch, CURLOPT_FILE, $fp); 
        curl_setopt($ch, CURLOPT_HEADER, 0); 
        curl_exec($ch); 
        curl_close($ch);
        fclose($fp); 
    }
    require __DIR__ . '/vendor/autoload.php';
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