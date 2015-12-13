<?php

class api {

    private $db;

    private $colours = array(
            "#03C03C",
            "#FF6961",
            "#B39EB5",
            "#966FDF",
            "#AEC6CF",
            "#C23B22",
            "#F49AC2",
            "#DEA5A4",
            "#77DD77",
            "#CB99C9",
            "#B19CD9",
            "#CFCFC4",
            "#FDFD96",
            "#779ECB",
            "#FFB347",
            "#FFD1DC");

    private $class_list = array(
            "AHI" => "Ancient History",
            "BIO" => "Biology",
            "BST" => "Business Studies",
            "CAR" => "Careers",
            "CHE" => "Chemistry",
            "COM" => "Commerce",
            "DAT" => "Design Tech",
            "ECO" => "Economics",
            "ELH" => "Elective History",
            "EN"  => "English",
            "ENX" => "English Ext 2",
            "EST" => "Engineering",
            "FRE" => "French",
            "FRX" => "French Ext",
            "FTE" => "Food Tech",
            "GEO" => "Geography",
            "GER" => "German",
            "GEX" => "German Ext",
            "GTE" => "Graphics Tech",
            "HEX" => "Elective History",
            "HIS" => "History",
            "IND" => "Indonesian",
            "INX" => "Indonesian Ext",
            "IPT" => "IPT",
            "JAP" => "Japanese",
            "JAX" => "Japanese Ext",
            "LAT" => "Latin",
            "LAX" => "Latin Ext",
            "LIB" => "Library",
            "LST" => "Legal Studies",
            "MAT" => "Mathematics",
            "MHI" => "Modern History",
            "MM"  => "Mathematics",
            "MU"  => "Music",
            "MUX" => "Music Ext",
            "PAS" => "PASS",
            "PSY" => "Power Systems",
            "PDH" => "PDHPE",
            "PHY" => "Physics",
            "RC"  => "Roll Call",
            "SCI" => "Science",
            "SDD" => "Software Design",
            "VAR" => "Visual Arts"
    );

    private $reverse_list = array(
        "Ancient History"=> "AHI",
        "Biology"=> "BIO",
        "Business Studies"=> "BST",
        "Careers"=> "CAR",
        "Chemistry"=> "CHE",
        "Commerce"=> "COM",
        "Design Tech"=> "DAT",
        "Economics"=> "ECO",
        "Elective History"=> "ELH",
        "English"=> "EN",
        "English Ext 2"=> "ENX",
        "Engineering"=> "EST",
        "French"=> "FRE" ,
        "French Ext"=> "FRX",
        "Food Tech"=> "FTE",
        "Geography"=> "GEO",
        "German"=> "GER",
        "German Ext"=> "GEX",
        "Graphics Tech"=> "GTE",
        "Elective History"=> "HEX",
        "History"=> "HIS" ,
        "Indonesian"=> "IND",
        "Indonesian Ext"=> "INX",
        "IPT"=> "IPT",
        "Japanese"=> "JAP",
        "Japanese Ext"=> "JAX",
        "Latin"=> "LAT",
        "Latin Ext"=> "LAX",
        "Library"=> "LIB",
        "Legal Studies"=> "LST",
        "Mathematics"=> "MAT",
        "Modern History"=> "MHI",
        "Mathematics"=> "MM",
        "Music"=> "MU",
        "Music Ext"=> "MUX" ,
        "PASS"=> "PAS" ,
        "Power Systems"=> "PSY",
        "PDHPE"=> "PDH",
        "Physics"=> "PHY",
        "Roll Call"=> "RC",
        "Science"=> "SCI",
        "Software Design"=> "SDD",
        "Visual Arts" => "VAR"
        );

    function __construct($db) {
        $this->db = $db;
    }

    function getTimes() {

        for($i = 1; $i <= 10; $i++) {
            $times[$i] = $this->db->executeQuery("SELECT \"StartTime\", \"EndTime\" FROM liss_bell_times where \"Period\" not like 'R' and \"Period\" not like 'L1' and \"Period\" not like 'L2' and \"DayNumber\"=:day", array(
                ":day" => $i));
        }

        foreach($times as $key => &$value) {
            foreach($value as $key1 => &$value1) {
                $value1['starttime'] = substr($value1['StartTime'], 0, -3);
                $value1['endtime'] = substr($value1['EndTime'], 0, -3);
                unset($value1['StartTime']);
                unset($value1['EndTime']);
            }
        }

        return $times;
    }

    function getTimetableByClass($id) {
        $classes = $this->db->executeQuery("SELECT \"ClassCode\" FROM liss_class_memberships WHERE \"StudentId\"=:id", array(
            ":id" => $_GET['id']));

        foreach($classes as $key => &$value) {
            $course_pretty = $this->db->executeQuery("SELECT \"CourseName\" from liss_classes where \"ClassCode\"=:code", array(
                ":code" => $value['class_code']));
            $value['class_prettyname'] = $course_pretty[0]['course_name'];

            $value['times'] = $this->db->executeQuery("select \"DayNumber\",\"Period\",\"TeacherId\",\"RoomCode\" from liss_timetable_entries where \"ClassCode\"=:classcode", array(
                ":classcode" => $value['class_code']));
        }

        return $classes;
    }

    function getTimetableByDay($id) {
        $days = range(1,10);
        $data = array();

        foreach($days as $value) {
            $data[$value] = $this->db->executeQuery("SELECT \"Period\",\"ClassCode\",\"TeacherId\",\"RoomCode\" from liss_timetable_entries WHERE \"ClassCode\" IN (select \"ClassCode\" from liss_class_memberships where \"StudentId\"=:studentid) and \"DayNumber\"=:daynumber ORDER BY \"Period\" asc", array(
                ":studentid" => $id,
                ":daynumber" => $value));

            foreach($data[$value] as &$period) {
                $period['period'] = $period['Period']; unset($period['Period']);
                $period['class_code'] = $period['ClassCode']; unset($period['ClassCode']);
                $period['teacher_id'] = $period['TeacherId']; unset($period['TeacherId']);
                $period['room_code'] = $period['RoomCode']; unset($period['RoomCode']);
            }

            if(empty($data[$value])) {
                header("HTTP/1.1 404 NOT FOUND");
                return array(
                            "error" => true,
                            "code" => "418 I AM A TEAPOT.",
                            "message" => "User not found");
            }

            if($value == 3 || $value ==8) {
                for($x = 0; $x <= 3; $x++) {
                    $data[$value][$x]['class_code'] = preg_replace("/ (\d\w\d)| ([A-Z]\d)/", "", $data[$value][$x]['class_code']);

                    if($data[$value][$x]['period'] != $x) {
                        array_splice($data[$value], $x, 0, array(array(
                            "period" => $x,
                            "class_code" => "Free",
                            "teacher_id" => "",
                            "room_code" => "")));
                    }

                }
            } else {
                for($x = 0; $x <= 6; $x++) {
                    $data[$value][$x]['class_code'] = preg_replace("/ (\d\w\d)| ([A-Z]\d)/", "", $data[$value][$x]['class_code']);

                    if($data[$value][$x]['period'] != $x) {
                        array_splice($data[$value], $x, 0, array(array(
                            "period" => $x,
                            "class_code" => "Free",
                            "teacher_id" => "",
                            "room_code" => "")));
                    }

                }

                if($data[$value]['7']['period'] != "AS") {
                    array_splice($data[$value], 7, 0, array(array(
                        "period" => "AS",
                        "class_code" => "Free",
                        "teacher_id" => "",
                        "room_code" => "")));
                }
            }

            array_splice($data[$value], 1, 0, array_splice($data[$value], -1));
        }

        foreach($data as $key => &$value) {

            foreach($value as $key1 => &$value1) {

                foreach($this->class_list as $key2 => $value2) {

                    if(strpos($value1['class_code'], $key2) !== false) {
                        $value1['class_code'] = $value2;
                        continue;
                    }

                }

            }

        }

        return $data;
    }

    public function getClasses() {

        $classes = $this->db->executeQuery("SELECT liss_class_memberships.\"ClassCode\", liss_classes.\"CourseName\", liss_classes.\"DefaultTeacher\" FROM liss_class_memberships INNER JOIN liss_classes ON liss_class_memberships.\"ClassCode\"=liss_classes.\"ClassCode\" WHERE \"StudentId\"=:id", array(
            ":id" => $_GET['id']));

        if(empty($classes)) {
            header("HTTP/1.1 404 NOT FOUND");
            return array(
                        "error" => true,
                        "code" => "418 I AM A TEAPOT.",
                        "message" => "User not found");
        } 

        foreach($classes as &$class) {
            $class['class_code'] = $class['ClassCode'];
            $class['course_name'] = $class['CourseName'];
            $class['default_teacher'] = $class['DefaultTeacher'];

            unset($class['ClassCode']); unset($class['CourseName']); unset($class['DefaultTeacher']);
        }

        $named_classes = [];

        foreach($classes as $key => &$value) {
            $class_name = preg_replace("/ (\d\w\d)| ([A-Z]\d)/", "", $value['class_code']);

            foreach($this->class_list as $key2 => $value2) {

                if(strpos($class_name, $key2) !== false) {
                    $class_name = $value2;
                    $value['class_code'] = $value2;
                    continue;
                }

            }

            $named_classes[$class_name] = $value;

            $seed = md5($value['class_code']);
            srand($seed + 0);
            $num = rand(0, count($this->colours)-1);

            $named_classes[$class_name]['colour'] = $this->colours[$num];
            $named_classes[$class_name]['homework'] = [];

            unset($this->colours[$num]);
            sort($this->colours);
        }

        $named_classes['Free'] = array(
            "class_code" => "Free",
            "course_code" => "Free",
            "default_teacher" => "",
            "colour" => "#ffffff",
            "homework" => []);

        $named_classes['Other'] = array(
            "class_code" => "Other",
            "course_code" => "Other",
            "default_teacher" => "",
            "colour" => "#BEC596",
            "homework" => []);

        return $named_classes;
    }

}