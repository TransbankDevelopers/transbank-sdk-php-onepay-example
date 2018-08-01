### Proyecto de ejemplo para Transbank SDK PHP

El siguiente proyecto es un simple ecommerce el cual utiliza el SDK de Transbank para PHP, 
mostrando ejemplos de como crear una transacción (_Transaction_::create), como confirmarla
(_Transaction_::commit) y como anularla (_Refund_::create), utilizando Onepay.

Para ejecutar el proyecto es necesario tener ```docker``` y ```docker-compose```

Teniendo eso, puedes ejecutar en la raíz del proyecto:

```bash
docker-compose run web composer install
```
para instalar las dependencias.

Luego, para ejecutar el proyecto:
```
docker-compose run --service-ports web php artisan serve --host=0.0.0.0 --port=8000
```
También puedes simplemente ejecutar el archivo `run.sh` en la raíz del proyecto


Es posible ver las operaciones del SDK implementadas en la clase TransactionController,
la cual esta en 
`
REPO_ROOT/app/Http/Controllers/Transaction.php
`

El proyecto incluye, en su raíz, un archivo .env con valores de prueba para ONEPAY_SHARED_SECRET y ONEPAY_API_KEY, los cuales son útiles para poder hacer pruebas.

Este proyecto está hecho en PHP 7.2 utilizando Laravel 5.6

