<?php

class parser {

    public function parse($data, $type) {
        header("Content-type: application/json");

        switch($type) {
            case "times":
                $data = $this->parseTimes($data);
                break;
            case "timetable":
                $data = $this->parseTimetable($data);
                break;
        }

        echo json_encode($data, JSON_PRETTY_PRINT);
    }

    private function parseTimes($data) {
        return $data;
    }

    private function parseTimetable($data) {
        return $data;
    }

}