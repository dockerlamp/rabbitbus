FROM php:7.1-cli

# Install Composer
RUN \
    curl --output composer-setup.php https://getcomposer.org/installer && \
    php composer-setup.php --version=1.2.2 --install-dir=/usr/local/bin --filename=composer && \
    rm ./composer-setup.php

# Install git & zip required for composer
RUN \
    apt-get update && \
    apt-get install -y git zip && \
    rm -r /var/lib/apt/lists/*

# PHP CONFIG
# Time Zone
RUN \
    echo "date.timezone=Europe/Warsaw" > $PHP_INI_DIR/conf.d/date_timezone.ini

# RUN yes | pecl install xdebug \
#     && echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" > /usr/local/etc/php/conf.d/xdebug.ini
# COPY xdebug.ini /xdebug.ini
# RUN cat /xdebug.ini >> /usr/local/etc/php/conf.d/xdebug.ini

RUN docker-php-ext-install bcmath