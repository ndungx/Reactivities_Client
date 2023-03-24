# stage1 - build react app first 
FROM node:16.17.0-alpine3.16 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./package*.json /app/
RUN npm install --legacy-peer-deps
COPY . /app
ARG REACT_APP_API_URL
ARG REACT_APP_API_CHAT_URL
ARG GENERATE_SOURCEMAP
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.23.1-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]