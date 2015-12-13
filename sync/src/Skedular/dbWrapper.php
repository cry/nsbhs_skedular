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