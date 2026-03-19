FROM node:22.18 AS builder
ENV TZ=America/Sao_Paulo
WORKDIR /app
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  make \
  g++
COPY package*.json ./
COPY . .
RUN npm install -g node-gyp
RUN npm install
ENV CHOKIDAR_USEPOLLING=true
RUN npm run build

FROM node:22.18 AS runner
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  make \
  g++
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY . .

COPY package*.json ./