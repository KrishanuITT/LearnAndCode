<?php

class HTMLPrinter implements Printer {
    public function printPage($page) {
        echo '<div style="single-page">' . $page . '</div>';
    }
}
