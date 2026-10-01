FROM node:24-alpine

WORKDIR /app

COPY package.json ./
# no dependencies, but keeps npm install cached for future deps
RUN npm install --omit=dev 2>/dev/null || true

COPY server.js ./
COPY public ./public

ENV PORT=3000 NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
