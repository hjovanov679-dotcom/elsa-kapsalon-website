FROM php:8.5-apache

# PostgreSQL vereist de PDO-driver pdo_pgsql en de libpq-bibliotheek.
RUN apt-get update \
    && apt-get install -y --no-install-recommends unzip libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
RUN composer install --no-dev --prefer-dist \
    --no-interaction --optimize-autoloader

# PHP-fouten gaan naar de serverlogs, niet door de JSON-response heen.
RUN printf '%s\n' 'display_errors=Off' 'log_errors=On' \
    > /usr/local/etc/php/conf.d/api-errors.ini

# Apache luistert op Render's standaardpoort.
RUN sed -i 's/Listen 80/Listen 10000/' /etc/apache2/ports.conf \
    && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:10000>/' \
    /etc/apache2/sites-available/000-default.conf

EXPOSE 10000

CMD ["apache2-foreground"]
