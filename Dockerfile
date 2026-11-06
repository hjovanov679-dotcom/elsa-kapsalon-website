FROM php:8.5-apache

# Installeer hulpmiddelen en de PHP-driver voor MySQL.
RUN apt-get update \
    && apt-get install -y --no-install-recommends unzip \
    && docker-php-ext-install pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Voeg Composer toe.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Kopieer de website en installeer de PHP-bibliotheken.
COPY . .
RUN composer install --no-dev --prefer-dist \
    --no-interaction --optimize-autoloader

# Laat Apache luisteren op Render's standaardpoort.
RUN sed -i 's/Listen 80/Listen 10000/' /etc/apache2/ports.conf \
    && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:10000>/' \
    /etc/apache2/sites-available/000-default.conf

EXPOSE 10000

CMD ["apache2-foreground"]
