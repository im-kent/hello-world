FROM node:24-alpine

WORKDIR /app

COPY package.json ./
# no dependencies, but keeps npm install cached for future deps
RUN npm install --omit=dev 2>/dev/null || true

COPY server.js ./
COPY public ./public

ENV PORT=3000 NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
