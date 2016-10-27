<?php
    /**
     * Created by PhpStorm.
     * User: multi
     * Date: 30.09.2016
     * Time: 12:31
     */
    
    define('DIR_ROOT', $_SERVER['DOCUMENT_ROOT'] . '/published/SC/html/scripts');
    
    include_once(DIR_ROOT . '/includes/init.php');
    include_once(DIR_CFG . '/connect.inc.wa.php');
    include(DIR_FUNC . '/setting_functions.php');
    
    print($_SESSION['log']);