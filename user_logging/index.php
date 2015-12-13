<?php header("Content-type: text/json");

header("X-Application: Skedular User Tracking");

class dbWrapper
{

    private $db;
    private $details = array(
        "host"     => "localhost",
        "dbname"   => "sked_data",
        "username" => "redacted",
        "password" => "redacted"
        );

    public function __construct()
    {
        $this->db = new \PDO(sprintf("pgsql:host=127.0.0.1;user=%s;dbname=%s;password=%s", $this->details['username'], $this->details['dbname'], $this->details['password']));
    }

    public function executeQuery($query, $params = array()) 
    {
        $stmt = $this->db->prepare($query);

        try
        {
            $stmt->execute($params);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } 
            catch (\Exception $e) 
        {
            return false;
        }

        return $results;
        
    }
}

if (!isset($_GET['id'])) {
	header("HTTP/1.1 400 Malformed Request");
	print_r("2");
	exit;
}

$db = new dbWrapper;

$results = $db->executeQuery("INSERT INTO users (student) VALUES (:student)", array(
	":student" => $_GET['id']));

if(!$results) {
	print_r("1");
	exit;
}


print_r("0");
exit;