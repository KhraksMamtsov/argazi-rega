FROM nginx
COPY dist /usr/share/nginx/html
HEALTHCHECK CMD [ "service", "nginx", "status" ]