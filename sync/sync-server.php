<?php

define("VERSION", 1);

use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;
use Skedular\Sync;

    require dirname(__DIR__) . '/sync/vendor/autoload.php';
    require "src/Skedular/Sync.php";

    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Sync()
            )
        ),
       8001 
    );

    $server->run();
