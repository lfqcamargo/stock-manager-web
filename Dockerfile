FROM node:20.19-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ARG VITE_ENABLE_API_DELAY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENABLE_API_DELAY=$VITE_ENABLE_API_DELAY

COPY package.json .
RUN npm install

COPY . .

RUN npm run build
RUN npm ci --omit=dev && npm cache clean --force

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]