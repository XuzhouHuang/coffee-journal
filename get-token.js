const http = require('http');
const https = require('https');

const clientId = process.env.AZURE_MI_CLIENT_ID;
const identityEndpoint = process.env.IDENTITY_ENDPOINT;
const identityHeader = process.env.IDENTITY_HEADER;

if (!identityEndpoint || !identityHeader) {
  console.error('IDENTITY_ENDPOINT/IDENTITY_HEADER not set');
  process.exit(1);
}

const resource = 'https://database.windows.net/';
let url = `${identityEndpoint}?api-version=2019-08-01&resource=${encodeURIComponent(resource)}`;
if (clientId) url += `&client_id=${clientId}`;

const mod = url.startsWith('https') ? https : http;
const req = mod.get(url, { headers: { 'X-IDENTITY-HEADER': identityHeader } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const token = JSON.parse(data).access_token;
      if (!token) throw new Error('No access_token: ' + data.substring(0, 200));
      // Decode token to get OID
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        // Write debug info to a file that server.js can read
        require('fs').writeFileSync('/tmp/token-debug.txt', 
          `oid=${payload.oid} appid=${payload.appid} sub=${payload.sub}\n`);
        // Also log to stderr which goes to container logs
        process.stderr.write(`DEBUG: oid=${payload.oid} appid=${payload.appid}\n`);
      } catch(e) {}
      console.log(token);
    } catch (e) {
      console.error('Parse failed:', e.message);
      process.exit(1);
    }
  });
});
req.on('error', (e) => { console.error('Request failed:', e.message); process.exit(1); });
