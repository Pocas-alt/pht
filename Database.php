<?php
class Database
{
    public static function connect()
    {
        $config = require __DIR__ . '/convert/config.php';
        return new PDO(
            "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8",
            $config['user'],
            $config['pass']
        );
    }
}