import { createApp } from './app';

const PORT = Number(process.env.PORT) || 8080;
const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`[Suraksha AI] Guardian Engine listening on http://0.0.0.0:${PORT}\n`);
  }
});
