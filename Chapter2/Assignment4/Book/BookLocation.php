<?php

class BookLocation {
    private $shelf;
    private $room;

    public function __construct($shelf, $room) {
        $this->shelf = $shelf;
        $this->room = $room;
    }

    public function getLocation() {
        return "Shelf: " . $this->shelf . ", Room: " . $this->room;
    }
}
