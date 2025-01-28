<?php

class PlainTextPrinter implements Printer {
    public function printPage($page) {
        echo $page;
    }
}
