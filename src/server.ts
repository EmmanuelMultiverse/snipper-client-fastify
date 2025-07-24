
import Fastify from 'fastify';
import app from './app';

const fastify = Fastify({
  logger: true
});

fastify.register(app);

const start = async () => {
  try {
    const address = await fastify.listen({ port: 3000, host: '127.0.0.1' });
    fastify.log.info(`Server listening on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();