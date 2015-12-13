<?php

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

$db = new dbWrapper;

$views = $db->executeQuery("SELECT * FROM users");

function markup($views) {
    $x = "";

    foreach($views as $user) {
        printf("<li>%d</li>", $user['student']);
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Sked Info</title>

	<link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="../assets/skedular/styles.css">
</head>
<body>

	<div class="container">
		<div style="padding-top:10px">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title center">Statistics</h3>
				</div>
				<div class="panel-body" style="margin: 15px">
					<h4>Total Users: <b><?php echo count($views) ?></b></h4> 

                    <div class="filler"></div>

                    <h4>User List:</h4>
                        <ul style="margin: 15px">
                            <?php //print_r(markup($views)) ?>
                        </ul>
				</div>
			</div>
		</div>
	</div>
	
</body>
</html>