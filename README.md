# Proyecto de ejemplo para uso de Onepay con el SDK de Transbank para PHP

El siguiente proyecto es un simple ecommerce el cual utiliza Onepay a través del
SDK de Transbank para PHP,  mostrando ejemplos de como crear una transacción (_Transaction_::create), como confirmarla
(_Transaction_::commit) y como anularla (_Refund_::create)

## Requerimientos
Para ejecutar el proyecto es necesario tener: 
 ```docker``` y ```docker-compose``` ([como instalar Docker](https://docs.docker.com/install/))

## Ejecutar ejemplo
Con el código fuente del proyecto en tu computador, puedes ejecutar en la raíz del proyecto:

```bash
docker-compose run web composer install
```
para instalar las dependencias, y

```
docker-compose run --service-ports web php artisan serve --host=0.0.0.0 --port=8000
```
También puedes iniciar el proyecto simplemente ejecutando el archivo `run.sh` en la raíz del proyecto

En ambos casos el proyecto se ejecutará en http://localhost:8000 (y fallará en caso de que el puerto 8000 no esté disponible)

Es posible ver las operaciones del SDK implementadas en la clase TransactionController,
la cual esta en 
`
REPO_ROOT/app/Http/Controllers/Transaction.php
`

Asimismo, es posible ver la utilización del SDK de JavaScript en el archivo 
`
REPO_ROOT/public/js/use-onepay.js
`

El proyecto incluye, en su raíz, un archivo .env con valores para `ONEPAY_SHARED_SECRET`  y `ONEPAY_API_KEY`, los cuales son útiles para poder hacer pruebas.

Este proyecto está hecho en PHP 7.2 utilizando Laravel 5.6

