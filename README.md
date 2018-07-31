### Transbank SDK for PHP example project

The following is a simple ecommerce that uses the Transbank SDK for PHP,
showing examples of how to create a Transaction, Committing it (confirm it so it's actually paid) and reversing it (nulling it) using Onepay.

To run this project you need to have Docker and `docker-compose` installed on your machine.

You can then run:
```bash
docker-compose run web composer install
```
to install dependencies
Then, to run the project:

```
docker-compose run --service-ports web php artisan serve --host=0.0.0.0 --port=8000
```

You can see all the implemented SDK operations on the TransactionController on
`
REPO_ROOT/app/Http/Controllers/Transaction.php
`

or you can simply run the `run.sh` file in the root directory of the project.

This project is made in PHP 7.2 using Laravel 5.6.
