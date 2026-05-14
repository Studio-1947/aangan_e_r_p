import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'api-gatekeeper-mock',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/gatekeeper' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { passcode } = JSON.parse(body);
                const MASTER_PASS = "aangan2024"; // Fallback for local dev

                if (passcode === MASTER_PASS) {
                  res.setHeader('Set-Cookie', `lokmap_gate=${MASTER_PASS}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`);
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.statusCode = 401;
                  res.end(JSON.stringify({ success: false, error: 'Invalid Passcode' }));
                }
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
})
