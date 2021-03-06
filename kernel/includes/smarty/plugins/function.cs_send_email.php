<?php

/**
 * Smarty plugin
 * -------------------------------------------------------------
 * Type:     function
 * Name:     count
 * Purpose:  assign a number of array members to 'item' param
 * -------------------------------------------------------------
 */
function smarty_function_cs_send_email($params, &$smarty)
{

    //if ($_SESSION['log'] == 'sales') {
    //    $text = "<script defer src='/published/SC/html/scripts/js/send_email1.js'></script><div id='my_log' style=''>Отправка заказа ... Пожалуйста, дождитесь результата...</div>";

    //} else {

    $defer = defer();

    $text = "<script $defer src='/published/SC/html/scripts/js/send_email.js'></script>
<div id='my_log' style=''>Отправка заказа ... Пожалуйста, дождитесь результата...</div>
	";
    //}

// <SCRIPT language='JavaScript'>
    // var inlog=0;
    // $(document).ready(function()
    // {
    // $('#my_log').load('/popup/sendmail.php');
    // });
// </SCRIPT>


    return $text;
}

function defer()
{
    $defer = 'defer';
    $useragent = $_SERVER['HTTP_USER_AGENT'];
    $mobiles = array(/*'IEMobile', 'Edge', */'MSIE');

    foreach ($mobiles as $mobile) {
        $match = stripos($useragent, $mobile);
        if ($match) {
            $defer = '';
            return $defer;
        }
    }

    return $defer;
}