# build environment
FROM node:12.20.1-alpine as build
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH \
    HONEYCOMB_URI=ENV_VAR_HONEYCOMB_URI \
    HONEYCOMB_GEOM_SOCKET_URI=ENV_VAR_HONEYCOMB_GEOM_SOCKET_URI \
    HONEYCOMB_VIDEO_STREAM_URI=ENV_VAR_HONEYCOMB_VIDEO_STREAM_URI \
    AUTH0_CLIENT_ID=ENV_VAR_AUTH0_CLIENT_ID \
    AUTH0_DOMAIN=ENV_VAR_AUTH0_DOMAIN \
    AUTH0_CALLBACK=ENV_VAR_AUTH0_CALLBACK \
    HONEYCOMB_AUDIENCE=ENV_VAR_HONEYCOMB_AUDIENCE
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.17.6-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY scripts /usr/share/scripts
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["/usr/share/scripts/startup-prod.sh"]