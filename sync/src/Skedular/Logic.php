<?php

namespace Skedular;

require 'dbWrapper.php';

class Logic {

	private $db;

	public function __construct() {
		$this->db = new \dbWrapper;
	}

	public function checkRequest($conn, $msg, &$client_pool) {
		$contents = json_decode($msg);

		switch($contents->request) {
			case "last_change":
				$this->checkLastChange($contents, $conn);
				break;
			case "update":
				$this->update($conn, $contents);
				$this->propagate($conn, $contents, $client_pool);
				break;
		}
	}

		public function checkLastChange($contents, $conn) {
			$results = $this->db->executeQuery("SELECT last_update, data FROM sync WHERE id=:id AND key=:key", array(
				"id" => $contents->id,
				"key" => $contents->key));

			if(count($results) == 0) {
				$response = array(
					"last_update" => "null",
					"data"		  => "null",
					"response"	  => "last_update");
			} else {
				$response['response'] = "last_update";
				$response['data'] = $results[0]['data'];
				$response['last_update'] = $results[0]['last_update'];
			}

			$conn->send(json_encode($response));
		}

		public function update($conn, $contents) {
			$exists = $this->db->executeQuery("SELECT last_update, data FROM sync WHERE id=:id AND key=:key", array(
				"id" => $contents->id,
				"key" => $contents->key));

			if(count($exists) == 0) {
				$result = $this->db->executeQuery("INSERT INTO sync (id, key, data, last_update) VALUES (:id, :key, :data, :epoch)", array(
				"id" => $contents->id,
				"key" => $contents->key,
				"data" => $contents->data,
				"epoch" => $contents->epoch));
			} else {
				$result = $this->db->executeQuery("UPDATE sync SET id=:id, key=:key, data=:data, last_update=:epoch WHERE id=:id AND key=:key", array(
				"id" => $contents->id,
				"key" => $contents->key,
				"data" => $contents->data,
				"epoch" => $contents->epoch));
			}
		}

			public function propagate($conn, $contents, &$client_pool) {
				$sync_clients = $client_pool->{$contents->id}->{$contents->key};

				$data = $this->db->executeQuery("SELECT data, last_update FROM sync WHERE id=:id AND key=:key", array(
					"id" => $contents->id,
					"key" => $contents->key));

				$data[0]['response'] = "propagate";

				foreach($sync_clients as $client) {
					if($conn != $client) {
						$client->send(json_encode($data[0]));
					}
				}
			}

}

