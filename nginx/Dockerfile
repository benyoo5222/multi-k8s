# Production
# Nginx is used for routing traffic between static files or sending traffic to the API server
# So we just need to create a base image of Nginx but just overwrite the file for config
FROM nginx

COPY ./default.conf ./etc/nginx/conf.d/default.conf