#!/bin/sh
# Startup script: get Azure MI token and set DATABASE_URL, then start Next.js

if [ -n "$AZURE_SQL_SERVER" ]; then
  echo "Fetching MI access token..."
  # Azure IMDS endpoint for managed identity token
  TOKEN=$(wget -qO- \
    "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fdatabase.windows.net%2F" \
    --header "Metadata: true" 2>/dev/null | \
    node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).access_token)}catch(e){console.error('Token parse failed:',e.message);process.exit(1)}})")

  if [ -z "$TOKEN" ]; then
    echo "WARNING: Failed to get MI token, falling back to DATABASE_URL"
  else
    echo "Token acquired (${#TOKEN} chars)"
    DB="${AZURE_SQL_DATABASE:-coffee-journal-db}"
    export DATABASE_URL="sqlserver://${AZURE_SQL_SERVER}:1433;database=${DB};encrypt=true;trustServerCertificate=false;token=${TOKEN}"
  fi
fi

exec node server.js
