<?php
    // -------------------------INITIALIZATION-----------------------------//
    ini_set('display_errors', true);
    define('DIR_ROOT', str_replace("\\", '/', realpath(__DIR__)));
    $DebugMode = false;
    $Warnings = array();
    include_once(DIR_ROOT.'/includes/init.php');
    include_once(DIR_CFG.'/connect.inc.wa.php');

    if (!SystemSettings::is_backend()) {
        foreach ($_GET as $name => $get) {
            if ($name != preg_replace('/[\>\<"\']/si', '', $name)) {
                unset($_GET[$name]);
                continue;
            }
            $_GET[$name] = preg_replace('/[\>\<"\']/si', '', $get);
        }
    }
    function generate_sig($endpoint, $params, $secret)
    {
        $sig = $endpoint;
        ksort($params);
        foreach ($params as $key => $val) {
            $sig .= "|$key=$val";
        }
        
        return hash_hmac('sha256', $sig, $secret, false);
    }
    
    $endpoint = '/media/657988443280050001_25025320';
    $params = array(
        'access_token' => 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
        'count'        => 10,
    );
    $secret = '6dc1787668c64c939929c17683d7cb74';
    
//    $sig = generate_sig($endpoint, $params, $secret);
//    echo $sig;
    
    
    //$greet = function($name)
    //{
    //    printf("Hello %s\r\n", $name);
    //};
    //
    //$greet('World');
    //$greet('PHP');
//    echo mktime(13, 02, 03, 4, 27, 2016);
//    echo '<br>'.date('F jS, Y g:i:s a', mktime(15, 23, 24, 4, 21, 2016));
    $ajax = false;
    if (isset($_GET['ajax'])) {
        $ajax = true;
        unset($_GET['ajax']);
    }
    
    //support for old urls
    //hack-like method

    if (MOD_REWRITE_SUPPORT
        && !SystemSettings::is_backend()
        && isset($_GET['__furl_path'])
        && !isset($_GET['ukey'])
        //&&((strlen($_GET['__furl_path'])
        //&&($_GET['__furl_path']=='index.php'))||(!strlen($_GET['__furl_path'])))
    ) {
        if (!isset($_GET['__furl_path'])) {
            $_GET['__furl_path'] = '';
        }
        if (isset($_GET['productID'])) {
            $_GET['__furl_path'] .= '/product/'.(int)$_GET['productID'];
        } elseif (isset($_GET['categoryID'])) {
            $_GET['__furl_path'] .= '/category/'.(int)$_GET['categoryID'];
        }
    }

    //support for old auxpages urls
    if (!SystemSettings::is_backend() && isset($_GET['show_aux_page'])) {
        $_GET['ukey'] = 'auxpage_'.(int)$_GET['show_aux_page'];
        unset($_GET['show_aux_page']);
    }

    //fix redirection
    if (isset($_GET['__furl_path']) && strpos($_GET['__furl_path'], 'published/SC/html/scripts/') === 0) {
        $_GET['__furl_path'] = substr($_GET['__furl_path'], strlen('published/SC/html/scripts/'));
    }

    //include_once(DIR_CLASSES.'/class.filewbs.php');
    //$fileEntry = new FileWBS();

    include(DIR_FUNC.'/setting_functions.php');
    if (isset($_GET['debug']) && ($_GET['debug'] === 'time' || $_GET['debug'] === 'total_time')) {

        $T = new Timer();
        $T->timerStart();
    }

//    $DB_tree = new DataBase();
    $DB_tree = ClassManager::getInstance('DataBase');
    $DB_tree->connect(SystemSettings::get('DB_HOST'), SystemSettings::get('DB_USER'), SystemSettings::get('DB_PASS'));
    $DB_tree->selectDB(SystemSettings::get('DB_NAME'));
    define('VAR_DBHANDLER', 'DBHandler');

    if (isset($_SESSION['__WBS_SC_DATA']['U_ID'])) {
        $fileEntry = new FileWBS();
        Functions::register($fileEntry, 'file_move_uploaded', 'move_uploaded');
        Functions::register($fileEntry, 'file_copy', 'copy');
        Functions::register($fileEntry, 'file_move', 'move');
        Functions::register($fileEntry, 'file_remove', 'remove');
        //Functions::register($fileEntry, 'file_exists', 'exists');
    }

    $Register = &Register::getInstance();
    $Register->set(VAR_DBHANDLER, $DB_tree);

    settingDefineConstants();

    define('FURL_ENABLED', 1);
    $urlEntry = ClassManager::getInstance('URL');
//    $urlEntry = new URL();
    $urlEntry->loadFromServerInfo();

    define('VAR_URL', 'URL');
    $Register->set(VAR_URL, $urlEntry);

    $_urlEntry = new URL();
    $_urlEntry->loadFromServerInfo();

    $furl_path = isset($_GET['__furl_path']) ? $_GET['__furl_path'] : '';

    if (strpos($furl_path, '/') === 0) {//it's not work properly on apache 1.xx when string start on '/' so it deleted
        $furl_path = substr($furl_path, 1);
        $_GET['__furl_path'] = $furl_path;
    }
    $Register->set('FURL_PATH', $furl_path);

    if ($furl_path === 'robots.txt') {
        header('HTTP/1.1 404 Not Found');
        header('Status: 404 Not Found');
        header('Content-type: text/html; charset=ISO-8859-1');
        echo '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">'.
            '<html><head>'.
            '<title>404 Not Found</title>'.
            '</head><body>'.
            '<h1>Not Found</h1>'.
            '<p>The requested URL was not found on this server.</p>'.
            '</body></html>';
        die();
    };
    
    //$_urlEntry->setPath('/');
    $_furl_path = $furl_path ? substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], $furl_path)) : $_SERVER['REQUEST_URI'];
    $_furl_path = substr($_furl_path, strlen(WBS_INSTALL_PATH));
    
    if (strpos($_furl_path, '/') === 0) {//it's not work properly on apache 1.xx when string start on '/' so it deleted
        $_furl_path = substr($_furl_path, 1);
        $_GET['__furl_path'] = $_furl_path;
    }
    
    while (!strpos($_furl_path, '//') === false) {
        $_furl_path = str_replace('//', '/', $_furl_path);
    }
    
    $_furl_path = explode('/', $_furl_path);
    
    if ((isset($_furl_path[0]) && strcmp(strtolower($_furl_path[0]), 'shop') === 0)) {
        $_furl_path = '/shop/';
    } else {
        $_furl_path = '/';
    }
    
    $_urlEntry->setPath(str_replace('//', '/', WBS_INSTALL_PATH.$_furl_path));
    $_urlEntry->setQuery('?');
    $__url = preg_replace('/\/[^\/]+$/', '', $_urlEntry->getURI());
    $CONF_FULL_SHOP_URL = $__url.(SystemSettings::is_hosted() || (SystemSettings::get('FRONTEND') !== 'SC') ? 'shop/' : '');
    $__wa_url = $__url;

    $pattern = '|^((http[s]{0,1}://([^/]+)/)'.substr(WBS_INSTALL_PATH, 1).')|msi';
    if (preg_match($pattern, $__url, $matches)) {
        $_base_url = $matches[2];
        $WIDGET_SHOP_URL = $matches[1];
    } else {
        $_base_url = $__url;
    }
    define('BASE_URL', $_base_url);
    define('BASE_WA_URL', $WIDGET_SHOP_URL);
    define('WIDGET_SHOP_URL', $WIDGET_SHOP_URL.(SystemSettings::is_hosted() || (SystemSettings::get('FRONTEND') !== 'SC') ? 'shop/' : ''));
    define('CONF_FULL_SHOP_URL', WIDGET_SHOP_URL);
    unset($_base_url);
    define('CONF_WAROOT_URL', WBS_INSTALL_PATH);
    define('CONF_ON_WEBASYST', SystemSettings::is_hosted());

    require_once(DIR_CFG.'/language_list.php');
    require_once(DIR_FUNC.'/category_functions.php');
    require_once(DIR_FUNC.'/product_functions.php');
    require_once(DIR_FUNC.'/statistic_functions.php');//*
    require_once(DIR_FUNC.'/country_functions.php');//*
    require_once(DIR_FUNC.'/zone_functions.php');//*
    require_once(DIR_FUNC.'/datetime_functions.php');
    require_once(DIR_FUNC.'/picture_functions.php');//*
    require_once(DIR_FUNC.'/configurator_functions.php');
    require_once(DIR_FUNC.'/option_functions.php');//*
    require_once(DIR_FUNC.'/discount_functions.php');
    require_once(DIR_FUNC.'/custgroup_functions.php');//*
    require_once(DIR_FUNC.'/currency_functions.php');
    require_once(DIR_FUNC.'/module_function.php');
    require_once(DIR_FUNC.'/registration_functions.php');
    require_once(DIR_FUNC.'/order_amount_functions.php');
    require_once(DIR_FUNC.'/catalog_import_functions.php');//*
    require_once(DIR_FUNC.'/cart_functions.php');
    require_once(DIR_FUNC.'/subscribers_functions.php');
    require_once(DIR_FUNC.'/discussion_functions.php');//*
    require_once(DIR_FUNC.'/order_status_functions.php');//*
    require_once(DIR_FUNC.'/order_functions.php');
    require_once(DIR_FUNC.'/shipping_functions.php');//*
    require_once(DIR_FUNC.'/payment_functions.php');//*
    require_once(DIR_FUNC.'/reg_fields_functions.php');//*
    require_once(DIR_FUNC.'/tax_function.php');//*
    require_once(DIR_CLASSES.'/class.virtual.shippingratecalculator.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/kernel/includes/smarty/Smarty.class.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/kernel/includes/smarty/resources/resource.rfile.php');
    require_once($_SERVER['DOCUMENT_ROOT'].'/kernel/includes/smarty/resources/resource.register.php');

    require_once(DIR_FUNC.'/search_function.php');

    if (!file_exists(DIR_COMPILEDTEMPLATES)) {
        mkdir(DIR_COMPILEDTEMPLATES);
    }

    /* init Smarty */
    $smarty = new View; //core smarty object
    $smarty_mail = new View; //for e-mails
//	$smarty->debugging_ctrl = 'URL';
    
    if (true || (0 && CONF_SMARTY_FORCE_COMPILE)) { //this forces Smarty to recompile templates each time someone runs index.php
        $smarty->force_compile = true;
        $smarty_mail->force_compile = true;
    } else {
        $smarty->force_compile = false;
        $smarty_mail->force_compile = false;
    }
    $smarty->register_resource('rfile', array('smarty_resource_rfile_source', 'smarty_resource_rfile_timestamp', 'smarty_resource_rfile_secure', 'smarty_resource_rfile_trusted'));
    $smarty->register_resource('register', array('smarty_resource_register_source', 'smarty_resource_register_timestamp', 'smarty_resource_register_secure', 'smarty_resource_register_trusted'));

    define('VAR_SMARTY', 'Smarty');
    $Register = &Register::getInstance();
    $Register->set(VAR_SMARTY, $smarty);

    //select a new language?
    if (isset($_POST['lang'])) {
        LanguagesManager::setCurrentLanguage($_POST['lang']);
        RedirectSQ();
    }
    if (isset($_GET['lang'])) {
        LanguagesManager::setCurrentLanguage($_GET['lang']);
        RedirectSQ('lang=');
    }
    
//    if (isset($_GET['mobile']) && !isset($_SESSION['mobile'])) {
//        $_SESSION['mobile'] = escape($_GET['mobile']);
//    }

    if (!MOD_REWRITE_SUPPORT and isset($_GET['lang_iso2'])) {
        $lang = LanguagesManager::getLanguageByISO2($_GET['lang_iso2']);
        if ($lang != null) {
            LanguagesManager::setCurrentLanguage($lang->id);
        };
        RedirectSQ('lang_iso2=');
    }

    $a = '';
    if (isset($_SESSION['enter'])) {
        $a = $_SESSION['enter'];
    }

    checkLogin($a);
    
    $conc = false;
    if (isset($_GET['__furl_path'])) {
        $conc = str_replace('/', '', $_GET['__furl_path']);
        switch ($conc) {
            case 'auxpage_divoland':
            case 'auxpage_mixtoys':
            case 'auxpage_dreamtoys':
            case 'auxpage_kindermarket':
            case 'auxpage_grandtoys':
            $conc = substr($conc, 8);
            $ajax = false;
            break;
            default:
                $conc = false;
        }
    }
    
    if ($ajax) {
    
        if (isset($_SESSION['import'], $_SESSION['slidetree'])) {
            
            $query = 'SELECT import from  SC_import_lock';
            $res = mysql_query($query) or die(mysql_error() . $query);
            $r = mysql_fetch_row($res);
            $import = (int)$r[0];
            
            if ((int)$_SESSION['import'] !== $import) {
                $ajax = false;
            }
        }
    }
    
    $smarty->assign('ajax', $ajax);
    $smarty->assign('conc', $conc);
    
    if (!detectMSIE()) {
        $smarty->assign('defer', 'defer');
    } else {
        $smarty->assign('MSIE', 'MSIE');
    }

    if (detectMobile()) {
//        $smarty->assign('ios', 'ios');
        $GetVars['view'] = 'mobile';
        $smarty->assign('PAGE_VIEW', 'mobile');
    }

    if (isset($_SESSION['xPOST']['g01j'])) {
        $smarty->assign('xpostdata', $_SESSION['xPOST']['g01j']);
    }
    
    $smarty->assign('yandex_info', yandexXMLexist());
    $smarty->assign('yandex_info_discount', yandexXMLexist(true));
    
    // $smarty->assign('lang_list', $lang_list);
    //    $cur_lang = LanguagesManager::getCurrentLanguage();
    /*@var $cur_lang Language*/
    //    $smarty->assign('lang_iso2', $cur_lang->iso2);
    $smarty->assign('lang_iso2', 'ru');

    // if (isset($_SESSION['current_language'])) $smarty->assign('current_language', $_SESSION['current_language']);
    /*
    ----------------------------------
    */
    $error404 = false;
    ModulesFabric::initGlobalModules();

    if (!MOD_REWRITE_SUPPORT and array_key_exists('productID', $_GET) and !array_key_exists('ukey', $_GET) && !array_key_exists('did', $_GET)) {
        $_GET['ukey'] = 'product';
    };
    
    $max_cnt = 200;
    $CurrDivision = null;
    
    do {
        $did = isset($_GET['did']) ? $_GET['did'] : 0;

        if (isset($_GET['ukey']) && $_GET['ukey']) {

            $did = DivisionModule::getDivisionIDByUnicKey($_GET['ukey']);
            set_query('did='.$did, '', true);
            if (!$did && ($_GET['ukey'] !== 'category') && (strpos($_GET['ukey'], 'index.php') !== 0)) {
                error404page();
            }
        }

        if (!$did) {
            if (!isset($furl1)) {
                $furl1 = true;
                fURL::exec();
                continue;
            }
            $did = DivisionModule::getDivisionIDByUnicKey('TitlePage');
        }

        $CurrDivision = &DivisionModule::getDivision($did);

        if ($did == 171) {
            $smarty->assign('remind_form', 1);
        }

        /*@var $CurrDivision Division*/
        if (!$CurrDivision->getID()) {

            if (!isset($furl1)) {
                $furl1 = true;
                fURL::exec();
                continue;
            }
            $CurrDivision->LinkDivisionUKey = 'TitlePage';
        }
    } while (--$max_cnt > 0 && (!is_object($CurrDivision) || !$CurrDivision->getID()));

    if ($max_cnt <= 0) {
        die('Couldnt load divisions');
    }

    if ($CurrDivision->LinkDivisionUKey != '') {
        $CurrDivision = &DivisionModule::getDivisionByUnicKey($CurrDivision->LinkDivisionUKey);
        set_query('&did='.$CurrDivision->getID().'&ukey='.$CurrDivision->getUnicKey(), '', true);
    }

    $Register->set(VAR_CURRENTDIVISION, $CurrDivision);
    $AdminDivID = DivisionModule::getDivisionIDByUnicKey('admin');
    $AdminChild = $CurrDivision->isBranchOf($AdminDivID);
    $admin_mode = ($CurrDivision->UnicKey == 'admin' || $AdminChild) && ($CurrDivision->UnicKey !== 'test');
    $Register->set('admin_mode', $admin_mode);

    if (!isset($furl1) && !$admin_mode and MOD_REWRITE_SUPPORT) {
        $furl1 = true;
        fURL::exec();
    }
    if ($admin_mode && !wbs_auth()) {

        $CurrDivision = &DivisionModule::getDivisionByUnicKey('TitlePage');

        $admin_mode = $AdminChild = false;
    }
    /*@var $CurrDivision Division*/

    $LanguageEntry = &LanguagesManager::getCurrentLanguage();

    $smarty->assign('BREADCRUMB_DELIMITER', '&raquo;');

    if (($admin_mode || $CurrDivision->UnicKey == 'cpt_constructor') && sc_getSessionData('LANGUAGE_ID') && sc_getSessionData('LANGUAGE_ID') != $LanguageEntry->id) {
        LanguagesManager::setCurrentLanguage(sc_getSessionData('LANGUAGE_ID'));
    }
    if (isset($lang_list[$LanguageEntry->id]) && file_exists(DIR_ROOT.'/languages/'.$lang_list[$LanguageEntry->id]->filename)) {
        //include a language file
        include('languages/'.$lang_list[$LanguageEntry->id]->filename);
    }
    $locals = $LanguageEntry->getLocals(array($admin_mode ? LOCALTYPE_BACKEND : LOCALTYPE_FRONTEND, LOCALTYPE_GENERAL, LOCALTYPE_HIDDEN), false, false);

    $smarty->assign('lang_direction', $LanguageEntry->direction);

    $Register->set('CURRLANG_LOCALS', $locals);
    $Register->set('CURR_LANGUAGE', $LanguageEntry);

    $DefLanguageEntry = &ClassManager::getInstance('Language');
    $DefLanguageEntry->loadById(CONF_DEFAULT_LANG);
    $deflocals = $DefLanguageEntry->getLocals(array($admin_mode ? LOCALTYPE_BACKEND : LOCALTYPE_FRONTEND, LOCALTYPE_GENERAL, LOCALTYPE_HIDDEN), false, false);

    $Register->set('DEFLANG_LOCALS', $deflocals);
    $Register->set('DEF_LANGUAGE', $DefLanguageEntry);

    $rMonths = array(
        1 => translate('str_month_january'), 2 => translate('str_month_february'), 3 => translate('str_month_march'), 4 => translate('str_month_april'), 5 => translate('str_month_may'), 6 => translate('str_month_june'), 7 => translate('str_month_july'), 8 => translate('str_month_august'), 9 => translate('str_month_september'), 10 => translate('str_month_october'), 11 => translate('str_month_november'), 12 => translate('str_month_december'),
    );
    $rWeekDays = array(
        0 => translate('str_week_monday'),
        1 => translate('str_week_tuesday'),
        2 => translate('str_week_wednesday'),
        3 => translate('str_week_thursday'),
        4 => translate('str_week_friday'),
        5 => translate('str_week_saturday'),
        6 => translate('str_week_sunday'),
    );
    include_once(DIR_INCLUDES.'/handler.message.php');

    checkPath(DIR_TEMP);

    $CurrDivision->loadCustomSettings();
    if (isset($_SESSION['log'])) {
        $smarty->assign('log', $_SESSION['log']);
    }

    $smarty->assign('CurrentDivision', array(
        'id'       => $CurrDivision->ID,
        'name'     => $CurrDivision->Name,
        'parentID' => $CurrDivision->ParentID,
        'ukey'     => $CurrDivision->UnicKey,
    ));

    $smarty_mail->template_dir = DIR_TPLS.'/email';

    if ($admin_mode) {
        
        include(DIR_FUNC.'/serialization_functions.php');
        include(DIR_FUNC.'/xml_parser.php');
        include(DIR_FUNC.'/xml_installer/xml_installer.php');
        include(DIR_CFG.'/paths.inc.php');

        $themeEntry = &ClassManager::getInstance('theme');
        /*@var $themeEntry Theme*/

        $res = $themeEntry->load(CONF_CURRENT_THEME);
        if (PEAR::isError($res)) {
            RedirectSQ('demo_theme_id='._getSettingOptionValue('CONF_CURRENT_THEME'));
        }
        //$themeEntry->load(CONF_CURRENT_THEME);
//        $smarty->assign('url_current_theme_css', $themeEntry->getURLOffset().'/main.css');
        $smarty->assign('url_current_theme_css', 'css/main.css');

        $AdminDeps = array();
        $SubDivs = &DivisionModule::getBranchDivisions($AdminDivID, array('xEnabled' => 1));
        
        foreach ($SubDivs as $_SubDiv) {
            $AdminDeps[] = array(
                'id'   => $_SubDiv->ID,
                'name' => $_SubDiv->Name,
            );
        }
        
        $BreadDivs = $CurrDivision->getBreadsToID($AdminDivID);
        
        if (count($BreadDivs) > 1) {
            $CurrDptID = $BreadDivs[1]->ID;
        } else {
            $CurrDptID = $CurrDivision->ID;
        }
        sc_checkLoggedUserAccess2Division($CurrDivision, $BreadDivs);

        if ($CurrDivision->UnicKey != 'admin') {
            $smarty->assign('SubDivs', DivisionModule::getBranchDivisions($CurrDptID, array('xEnabled' => 1)));
        }
        
        $smarty->assign('current_dpt', $CurrDptID);
        $smarty->assign('admin_departments', $AdminDeps);
        $smarty->assign('admin_departments_count', count($AdminDeps));
        $smarty->assign('admin_main_content_template', 'nav2level.tpl.html');

        $smarty->template_dir = DIR_TPLS;
        
    } else {

//        $enter = md5(uniqid('multi', true).$_SESSION['remote'].$_SERVER['HTTP_USER_AGENT'].mt_rand(1, 100));
//        $enter = md5($_SESSION['remote'].$_SERVER['HTTP_USER_AGENT']);
        $enter = md5($_SESSION['remote']);
        $smarty->assign('enter', $enter);

        $themeEntry = &ClassManager::getInstance('theme');
        /*@var $themeEntry Theme*/
        $res = $themeEntry->load(CONF_CURRENT_THEME);
        
        if (PEAR::isError($res)) {
            RedirectSQ('demo_theme_id='._getSettingOptionValue('CONF_CURRENT_THEME'));
        }
        
        $Register->set('CURRENT_THEME_ENTRY', $themeEntry);
//        $smarty->assign('PAGE_VIEW', isset($GetVars['view']) ? $GetVars['view'] : '');
        $smarty->assign('main_content_template', 'home.html');

        include(DIR_ROOT.'/includes/authorization.php');
        
        if (!isset($_SESSION['log'])) {
            $_SESSION['enter'] = $enter;
        }
        
        $smarty->assign('categoryID', isset($_GET['categoryID']) ? (int)$_GET['categoryID'] : 0);
        $smarty->template_dir = DIR_FTPLS;
    
        $css_m_main = array('/css/m.main.css');
        $smarty->assign('css_m_main', $css_m_main);
        
        $css_main = array('/css/main.css');
        $smarty->assign('css_main', $css_main);
        
        $js_multislidemenu = array('/js/multislidemenu.js');
        $smarty->assign('js_multislidemenu', $js_multislidemenu);
        
        $js_m_multislidemenu = array('/js/m.multislidemenu.js');
        $smarty->assign('js_m_multislidemenu', $js_m_multislidemenu);
        
        $js_baron = array('/js/baron.js');
        $smarty->assign('js_baron', $js_baron);
        
        $js_head = array('/js/head.js');
        $smarty->assign('js_head', $js_head);
    
        $js_m_head = array('/js/m.head.js');
        $smarty->assign('js_m_head', $js_m_head);
    
        $js_functions = array('/js/functions-dev.js');
        $smarty->assign('js_functions', $js_functions);
        
        $js_competitors = array('/js/competitors.js');
        $smarty->assign('js_competitors', $js_competitors);
        
        $js_JsHttpRequest = array(URL_JS.'/JsHttpRequest.js');
        $smarty->assign('js_JsHttpRequest', $js_JsHttpRequest);
    
        //$js_files = array('/js/multislidemenu.js', '/js/baron.js', '/js/head.js', '/js/functions-dev.js');
        //$smarty->assign('js_files', $js_files);
    }
    
    $InheritableInterfaces = $CurrDivision->getInheritableInterfaces();
    $Interfaces = $CurrDivision->getInterfaces();
    
    if (!$error404) {
        foreach ($InheritableInterfaces as $_Interface) {
            ModulesFabric::callInterface($_Interface);
        }

        foreach ($Interfaces as $_Interface) {
            ModulesFabric::callInterface($_Interface);
        }
    }
    
    if (!$admin_mode) {
        //security warnings!
        if (file_exists(DIR_ROOT.'/install.php')) $Warnings[] = translate('warning_delete_install_php');

        if (!(is_writable(DIR_TEMP) & is_writable(DIR_PRODUCTS_FILES) & is_writable(DIR_PRODUCTS_PICTURES) & is_writable(DIR_COMPILEDTEMPLATES))) {
            $Warnings[] = translate('warning_wrong_chmod');
        }
        //show admin a administrative mode link
        if (isset($_SESSION['log']) && !strcmp($_SESSION['log'], ADMIN_LOGIN)) {
            $Warnings[] = '<br><a href="'.set_query('ukey=admin').'">'.translate('lnk_administrativemode').'</a><br />';
        }
    }

    $smarty->assign('Warnings', $Warnings);
    $smarty->assign('https_connection_flag', $urlEntry->getScheme() === 'https');

    if (isset($_GET['market'])) {
        $smarty->assign('market_link', 'market');
    }
    
    if (isset($_GET['sales'])) {
        salesDebug();
    }

    if ($error404) {
        $smarty->assign('page_title', '404 '.translate('err_cant_find_required_page').' ― '.CONF_SHOP_NAME);
    }

    if ($admin_mode || ($CurrDivision->MainTemplate && !detectMobile() && (!isset($_GET['view']) || $GetVars['view'] !== 'mobile'))) {

        if (isset($GetVars['view']) && ($GetVars['view'] === 'noframe' || $GetVars['view'] === 'printable')) {
            $smarty->assign('main_body_tpl', $smarty->get_template_vars('main_content_template'));
        }

        $themeEntry = &$Register->get('CURRENT_THEME_ENTRY');

        if (!$admin_mode && is_object($themeEntry)) {
            $smarty->assign('URL_THEME_OFFSET', $themeEntry->getURLOffset());
        }

        $currencyEntry = Currency::getSelectedCurrencyInstance();

        if (is_object($currencyEntry)) {
            $smarty->assign('current_currency_js', $currencyEntry->getJSCurrencyInstance());
        }
        print $smarty->fetch($CurrDivision->MainTemplate);
        
    } else if (!$admin_mode) {

        $themeEntry = &$Register->get('CURRENT_THEME_ENTRY');

        if (is_object($themeEntry)) {
            $smarty->assign('URL_THEME_OFFSET', $themeEntry->getURLOffset());
        }

        define('PDA_VERSION', 1);
//        $smarty->assign('PAGE_VIEW', 'mobile');
        
        $main_body_tpl = $smarty->get_template_vars('main_content_template') ? : 'home.html';
        $frame = 'frame.html';
        
        if (file_exists(DIR_FTPLS.'/m.'.$main_body_tpl)) {
            $main_body_tpl = 'm.'.$main_body_tpl;
//            $frame = 'm.'.$frame;
        }

        $smarty->assign('main_body_tpl', $main_body_tpl);
        print $smarty->fetch($frame);
    }

    //DEBUG futures
    if (isset($_GET['debug']) && 
        ($_GET['debug'] === 'time' || 
         $_GET['debug'] === 'total_time')
    ) {
        print 'time: <strong>'.$T->timerStop().'</strong><br />';
    }

    //DEBUG futures
    //        if (isset($_GET['debug']) &&
    //            ($_GET['debug'] === 'time' ||
    //                $_GET['debug'] === 'total_time')
    //        ) {
    //            print 'time: <strong>'.$T->timerStop().'</strong><br />';
    //            var_dump(get_declared_classes());
    //        }