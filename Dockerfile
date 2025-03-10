FROM node:22-alpine as builder

WORKDIR /products_api

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Resulting image

FROM node:22-alpine

WORKDIR /products_api

COPY --from=builder /products_api/node_modules ./node_modules

COPY --from=builder /products_api/dist ./dist

COPY --from=builder /products_api/package*.json ./

COPY --from=builder /products_api/.env ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]