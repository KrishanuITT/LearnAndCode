<?php

class BookContent {
    private $currentPage = 1;

    public function turnPage() {
        $this->currentPage++;
    }

    public function getCurrentPage() {
        return "Page " . $this->currentPage . " content";
    }
}
