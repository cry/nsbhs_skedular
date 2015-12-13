<?php date_default_timezone_set("Australia/Sydney");

if(php_sapi_name() != 'cli') {
    header("Content-type: text/json");
}

class dbWrapper {

    private $dbHandle;

    public function __construct($username, $password, $db) {
        $this->dbHandle = new PDO("pgsql:host=127.0.0.1;user=". $username .";dbname=". $db .";password=".$password);
    }


    public function executeQuery($query, $params = array()) {
        $stmt = $this->dbHandle->prepare($query);

        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getErrorCode() {
        return $this->dbHandle->errorCode();
    }
}

function download($url) {
	$curl = curl_init($url);

	curl_setopt($curl, CURLOPT_USERPWD, "username:password");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_NTLM);

	$data = curl_exec($curl);

	return $data;
}

$db = new dbWrapper("redacted", "redacted", "sked_data");

$current_hash = file_get_contents("hash.txt");
$new_hash = md5(download("redacted"));

printf("\nCurrent hash: %s\nNew hash: %s\n", $current_hash, $new_hash);

if(substr($current_hash, 0, 7) === substr($new_hash, 0, 7)) {
	echo "\nHash match, no changes.\n";
	die;
}

echo "\nHash mismatch, updating.\n";

$sql = download("redacted");

!$sql ? function() {
	echo "\nError downloading new SQL.\n";
} : function() {
	echo "\nDownloaded new SQL.\n";
};

file_put_contents("new_data.mysql.sql", $sql);

echo "\nConverting..\n";

shell_exec("python c.py new_data.mysql.sql new_data.psql.sql");

echo "\nImporting data..\n";

echo "\nStep 1: Dropping tables..\n";
$db->executeQuery("DROP DATABASE skedular");
$db->executeQuery("CREATE DATABASE skedular");

echo "\nStep 2: Executing dump..\n";
shell_exec("export PGPASSWORD=redacted; psql -U redacted skedular < new_data.psql.sql");

file_put_contents("hash.txt", $new_hash);
file_put_contents("lastupdate", time());

print_r("\nUpdated.\n");
