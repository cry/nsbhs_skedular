<?php
/**
 * Created by PhpStorm.
 * User: carey
 * Date: 16/01/15
 * Time: 3:51 PM
 */

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