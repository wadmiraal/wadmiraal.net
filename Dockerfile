FROM ubuntu:16.04
WORKDIR /var/www

RUN apt-get update && apt-get install -y nodejs ruby ruby-dev npm
RUN gem install jekyll -v 2.5.2
RUN gem install compass rdiscount therubyracer liquid-inheritance
RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD ./package.json /var/www/package.json

RUN cd /var/www && npm install
