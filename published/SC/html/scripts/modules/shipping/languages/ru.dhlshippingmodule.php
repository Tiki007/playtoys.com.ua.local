<?php
define('DHLSHIPPINGMODULE_TTL', 'DHL');
define('DHLSHIPPINGMODULE_DSCR', 'DHL Airborne. Расчет стоимости доставки в DHL.<br>Необходимо наличие аккаунта на www.dhl.com');
define('DHL_CNF_ACCOUNT_NUMBER_TTL', 'Account number');
define('DHL_CNF_ACCOUNT_NUMBER_DSCR', 'Номер учетной записи (аккаунта) в DHL');
define('DHL_CNF_SHIPPING_KEY_TTL', 'Domestic Shipping key');
define('DHL_CNF_SHIPPING_KEY_DSCR', 'Введите Shipping Key, предоставленный Вам DHL');
define('DHL_CNF_ISHIPPING_KEY_TTL', 'International Shipping key');
define('DHL_CNF_ISHIPPING_KEY_DSCR', 'Введите Shipping Key, предоставленный Вам DHL');
define('DHL_CNF_DUTIABLE_TTL', 'Подлежит обложению таможенной пошлиной');
define('DHL_CNF_DUTIABLE_DSCR', 'Только для международной доставки');
define('DHL_CNF_BILLINGPARTY_TTL', 'Плательщик');
define('DHL_CNF_BILLINGPARTY_DSCR', 'Выбирите кто производит оплату услуг DHL - отправитель (Sender) или получатель (Receiver)');
define('DHL_CNF_SHIPDATE_TTL', 'Отправление через X дней');
define('DHL_CNF_SHIPDATE_DSCR', 'Введите количество дней, по истечению которых с момента оформления заказа DHL должен забрать посылку');
define('DHL_CNF_SHIPMENT_TYPE_TTL', 'Упаковка');
define('DHL_CNF_SHIPMENT_TYPE_DSCR', 'Выберите способ упавковки посылок');
define('DHL_CNF_TEST_MODE_TTL', 'Тестовый режим');
define('DHL_CNF_TEST_MODE_DSCR', '');
define('DHL_CNF_LOGIN_ID_TTL', 'API System ID');
define('DHL_CNF_LOGIN_ID_DSCR', 'Введите API System ID, предоставленный DHL');
define('DHL_CNF_PASSWORD_TTL', 'API Password');
define('DHL_CNF_PASSWORD_DSCR', 'Введите API Password, предоставленный DHL');
define('DHL_CNF_SERVICES_TTL', 'Доступные сервисы');
define('DHL_CNF_SERVICES_DSCR', 'Выберите сервисы DHL, которые будут предложены покупателю для выбора при оформлении заказа');
define('DHL_CNF_AP_TTL','Страхование отправления');
define('DHL_CNF_AP_DSCR','Включите, если Вы хотите, чтобы стоимость доставки расчитывалась с учетом стоимости страховки от ущерба и потери');
define('DHL_CNF_AP_VALUE_TTL','Размер суммы страхования');
define('DHL_CNF_AP_VALUE_DSCR','Если Вы выбрали страхование отправления, введите размер суммы страхования');
define('DHL_CNF_AP_VALUE_TYPE0','Сумма страхования равна сумме заказа');
define('DHL_CNF_AP_VALUE_TYPE1','Фиксированная страховая сумма');
define('DHL_CNF_DIMENSIONS_TTL','Габариты');
define('DHL_CNF_DIMENSIONS_DSCR','Если габариты (размер) отправлений в Вашем интернет-магазине фиксированы, введите их значения в дюймах в формате LxWxH, где L, W, H - длина, ширина и высота соответственно.<br>Если размеры не фиксированы, оставьте это поле пустым');
define('DHL_CNF_COD_TTL','Collect On Delivery');
define('DHL_CNF_COD_DSCR','Если оплата заказов производится по факту получения (Collect On Delivery - COD), выбирите способ приема оплаты.<br>Если опция COD включена, плательщиком должен быть отправитель.<br>Если Вы используете COD, выбирите n/a.');
define('DHL_CNF_USD_CURRENCY_TTL','Валюта "Доллары США"');
define('DHL_CNF_USD_CURRENCY_DSCR','Стоимость доставки, расчитываемая DHL, указывается в долларах США. Выберите валюту Вашего магазина, которая представляет собой доллары США для корректного пересчета стоимости доставки в другие валюты.');
define('DHL_CNF_ERROR_LOG_TTL','Включить запись ошибочных ответов сервера DHL');
define('DHL_CNF_ERROR_LOG_DSCR','В случае ошибки расчета стоимости доставки, сообщение об ошибке записывается в файл temp/dhl_errors.log');

define('DHL_TXTER_OVERWEIGHT','Превышен максимально допустимый вес ({%WEIGHT%})');
?>