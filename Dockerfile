# build environment
FROM node as builder

ARG RD_ERP_API_URL
ARG RD_ERP_LOGIN_URL

ENV RD_ERP_API_URL $RD_ERP_API_URL
ENV RD_ERP_LOGIN_URL $RD_ERP_LOGIN_URL

RUN echo "Login URL = $RD_ERP_LOGIN_URL"
RUN echo $RD_ERP_API_URL


RUN mkdir /usr/app

COPY . /usr/app/

WORKDIR /usr/app

RUN npm install --silent
RUN npm run build:prod

# production environment
FROM nginx:1.13.9-alpine
COPY --from=builder /usr/app/dist /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d
COPY config /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]