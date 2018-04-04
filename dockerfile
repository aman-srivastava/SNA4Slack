FROM nginx

COPY /conf/nginx.conf /etc/nginx/nginx.conf

COPY ./ /

EXPOSE 80
