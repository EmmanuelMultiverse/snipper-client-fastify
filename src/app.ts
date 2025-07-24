
import { FastifyPluginAsync } from 'fastify';
import path from 'path';

const app: FastifyPluginAsync = async (fastify, opts) => {
  
  await fastify.register(require(path.join(__dirname, 'plugins', 'db-plugin')), {
    filename: 'database.db' 
  });

  await fastify.register(require(path.join(__dirname, 'routes', 'users')));

  
};

export default app;