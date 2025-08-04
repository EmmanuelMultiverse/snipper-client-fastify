
import { FastifyPluginAsync } from 'fastify';

import dbPlugin from './plugins/db-plugin';
import userDecorators from './plugins/userDecorators';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

const app: FastifyPluginAsync = async (fastify, opts) => {
  
  await fastify.register(dbPlugin, {
    filename: "db.sqlite"
  })

  await fastify.register(userDecorators);

  await fastify.register(authRoutes, {
    prefix: "/auth"
  })

  await fastify.register(userRoutes, {
    prefix: "/users"
  });
};

export default app;