FROM httpd:alpine

# Add ServerName to avoid Apache warning
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

COPY . /usr/local/apache2/htdocs/

EXPOSE 80