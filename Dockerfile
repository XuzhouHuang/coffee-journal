FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="sqlserver://placeholder:1433;database=placeholder"
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/mssql ./node_modules/mssql
COPY --from=builder /app/node_modules/tedious ./node_modules/tedious
COPY --from=builder /app/node_modules/async-mutex ./node_modules/async-mutex
COPY --from=builder /app/get-token.js ./get-token.js
RUN chmod 644 ./get-token.js
USER nextjs
EXPOSE 3000
ENV PORT=3000
# Configure via Container App environment variables:
# AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_MI_CLIENT_ID
# AUTH_TENANT_ID, AUTH_CLIENT_ID, ALLOWED_APP_IDS
ENV DATABASE_URL=sqlserver://placeholder:1433;database=placeholder
CMD ["sh", "-c", "node get-token.js > /tmp/token.txt 2>/tmp/token-err.txt; export AZURE_SQL_TOKEN=$(cat /tmp/token.txt); cat /tmp/token-err.txt; cat /tmp/token-debug.txt 2>/dev/null || echo 'no debug file'; if [ -n \"$AZURE_SQL_TOKEN\" ]; then echo 'Token OK len='$(echo -n $AZURE_SQL_TOKEN | wc -c); else echo 'Token FAILED'; cat /tmp/token-err.txt; fi; exec node server.js"]
