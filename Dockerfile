FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

RUN NODE_ENV=production npm run build && npm prune --production

USER node

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
