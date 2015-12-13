<?php 

namespace Skedular;

require 'Logic.php';
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Sync implements MessageComponentInterface {

	protected $client_pool;
	protected $logic;

	public function __construct() {
		$this->client_pool = new \SplObjectStorage;


		$this->logic = new Logic;
	}

	public function onOpen(ConnectionInterface $conn) {

		$id = $conn->WebSocket->request->getQuery()['id'];
		$key = $conn->WebSocket->request->getQuery()['key'];

		if(!isset($this->client_pool->{$id})) {
			$this->client_pool->{$id} = new \SplObjectStorage;
		}

		if(!isset($this->client_pool->{$id}->{$key})) {
			$this->client_pool->{$id}->{$key} = new \SplObjectStorage;
		}

		$this->client_pool->{$id}->{$key}->attach($conn);

    }

    public function onMessage(ConnectionInterface $from, $msg) {

    	print_r(sprintf("Message from %d\n", $from->resourceId));

    	$this->logic->checkRequest($from, $msg, $this->client_pool);

    }

    public function onClose(ConnectionInterface $conn) {

    	$id = $conn->WebSocket->request->getQuery()['id'];
    	$key = $conn->WebSocket->request->getQuery()['key'];

    	$this->client_pool->{$id}->{$key}->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
    }

}