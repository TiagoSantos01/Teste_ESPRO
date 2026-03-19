FROM node:20 AS builder
ENV TZ=America/Sao_Paulo
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY exemple.env .env
RUN npm run build
FROM nginx:alpine
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
COPY default.conf /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]
