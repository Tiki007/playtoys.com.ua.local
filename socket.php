<?php
    /**
     * Created by PhpStorm.
     * User: multi
     * Date: 23.09.2016
     * Time: 16:39
     */
    
    $sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

// Пример списка IP-адресов, которые есть на компьютере
    $sourceips['kevin']    = '127.0.0.1';
    $sourceips['madcoder'] = '127.0.0.2';

// Привязываем адрес источника
    socket_bind($sock, $sourceips['madcoder']);

// Соединяемся с адресом назначения
    socket_connect($sock, '127.0.0.1', 80);

// Пишем в сокет
    $request = 'GET / HTTP/1.1' . "\r\n" .
        'Host: playtoys.com.ua.local' . "\r\n\r\n";
    socket_write($sock, $request);

// Закрываем сокет
    socket_close($sock);