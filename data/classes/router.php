<?php

class router {

    private $endpoint;

    function __construct($endpoint) {
        $this->endpoint = $endpoint;
    }

    function routeRequest($api) {
        switch($this->endpoint) {
            case "times":
                return $api->getTimes();
                break;
            case "timetable_class":
                return $api->getTimetableByClass($_GET['id']);
                break;
            case "timetable":
                return $api->getTimetableByDay($_GET['id']);
                break;
            case "classes":
                return $api->getClasses($_GET['id']);
                break;
            default:
                header("HTTP/1.1 404 NOT FOUND");
                return array(
                    "error" => true,
                    "code" => 404,
                    "message" => "Not Found");
                break;
        }
    }

}