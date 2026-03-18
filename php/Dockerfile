FROM php:8.4-apache

# composer
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# dependências PHP e habilitar rewrite
RUN apt-get update && apt-get install -y libzip-dev zip unzip git \
  && docker-php-ext-install pdo pdo_mysql zip \
  && a2enmod rewrite

# copiar todo o projeto (não só public)
COPY ./ /var/www/html
WORKDIR /var/www/html

# instalar dependências e ajustar permissões
RUN /usr/bin/composer install --no-interaction --prefer-dist --optimize-autoloader \
  && chown -R www-data:www-data /var/www/html \
  && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# configurar DocumentRoot para public
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80
CMD ["apache2-foreground"]