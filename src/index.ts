import { App } from '@slack/bolt';
import Fastify from 'fastify';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const fastify = Fastify({ logger: true });

fastify.post('/unleash-webhook', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.BEARER_TOKEN}`) {
    reply.code(401).send({ ok: false, error: 'Unauthorized' });
    return;
  }

  try {
    const event: any = request.body;

    await app.client.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: JSON.stringify(event),
    });
    reply.send({ ok: true });
  } catch (error) {
    reply.send({ ok: false });
  }
});

fastify.get('/health', async (_request, reply) => {
  reply.send({ status: 'ok' });
});

(async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log(`server listening on ${3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
