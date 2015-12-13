<?php

!isset($_GET['endpoint']) ? exit : 0;

(isset($_GET['id']) && is_numeric($_GET['id']) && strlen($_GET['id']) == 9) ? 0 : exit; 

require 'classes/dbwrapper.php';
require 'classes/router.php';
require 'classes/api.php';
require 'classes/parser.php';

$db = new dbWrapper("redacted", "redacted", "skedular");

$router = new router($_GET['endpoint']);
$api = new api($db);
$parser = new parser();

$results = $router->routeRequest($api);
$parser->parse($results, $_GET['endpoint']);