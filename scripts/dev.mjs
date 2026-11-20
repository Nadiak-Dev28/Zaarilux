import { createServer, loadEnv } from 'vite';
import { createOrderHandler } from '../api/order.js';

// Local full-stack development uses the same function as Vercel, never a pretend order.
const env = { ...loadEnv('development', process.cwd(), ''), ...process.env };
const order = createOrderHandler({ env });
const server = await createServer({
  server: { host: '0.0.0.0', port: Number(env.PORT || 5173) },
  plugins: [
    {
      name: 'zaarilux-local-orders',
      configureServer(vite) {
        vite.middlewares.use('/api/order', async (req, res) => {
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(data));
          };
          const chunks = [];
          let length = 0;
          try {
            for await (const chunk of req) {
              length += chunk.length;
              if (length > 32768) return res.status(413).json({ error: 'The order is too large.' });
              chunks.push(chunk);
            }
            req.body = Buffer.concat(chunks).toString('utf8');
            await order(req, res);
          } catch {
            if (!res.writableEnded)
              res.status(400).json({ error: 'The request could not be read.' });
          }
        });
      },
    },
  ],
});
await server.listen();
server.printUrls();
