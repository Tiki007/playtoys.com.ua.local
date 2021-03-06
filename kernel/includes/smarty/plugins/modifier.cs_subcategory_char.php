<?php
/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */


/**
 * Smarty strip modifier plugin
 *
 * Type:     modifier<br>
 * Name:     strip<br>
 * Purpose:  Replace all repeated spaces, newlines, tabs
 *           with a single space or supplied replacement string.<br>
 * Example:  {$var|strip} {$var|strip:"&nbsp;"}
 * Date:     September 25th, 2002
 * @link http://smarty.php.net/manual/en/language.modifier.strip.php
 *          strip (Smarty online manual)
 * @author   Monte Ohrt <monte at ohrt dot com>
 * @version  1.0
 * @param string
 * @param string
 * @return string
 */
function smarty_modifier_cs_subcategory_char($text)
{
  $query = "SELECT count(categoryID) as c FROM SC_categories WHERE parent = '$text'";
  $count = mysql_fetch_object(mysql_query($query))->c;
  if ($count)
  {
    return '&nbsp;+';
  } else return '&nbsp;';
}

/* vim: set expandtab: */

?>