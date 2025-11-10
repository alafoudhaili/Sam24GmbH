FROM node:16.20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:latest

COPY --from=builder /app/dist/velzon /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]





