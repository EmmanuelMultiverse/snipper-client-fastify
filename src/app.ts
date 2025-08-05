
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import dbPlugin from './plugins/db-plugin';
import userDecorators from './plugins/userDecorator';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import questionRoute from './routes/questions';
import fastJWT from "@fastify/jwt";
import questionDecorator from './plugins/questionDecorator';
import snippetDecorator from './plugins/snippetDecorator';
import snippetsRoute from './routes/snippets';

const app: FastifyPluginAsync = async (fastify, opts) => {

  const publicRoutes = ["/auth/login", "/auth/register"];

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new Error("JWT_SECRET must be defined.");
  
  await fastify.register(dbPlugin, {
    filename: "db.sqlite"
  })

  await fastify.register(questionDecorator);
  await fastify.register(userDecorators);
  await fastify.register(snippetDecorator);

  await fastify.register(fastJWT, {
    secret: jwtSecret,

  });

  await fastify.register(authRoutes, {
    prefix: "/auth"
  })

  await fastify.register(userRoutes, {
    prefix: "/users"
  });

  await fastify.register(questionRoute, {
    prefix: "/questions"
  })

  await fastify.register(snippetsRoute, {
    prefix: "/snippets"
  })

  fastify.addHook("preValidation", async (req: FastifyRequest, res: FastifyReply) => {

    if (req.routeOptions.url && publicRoutes.includes(req.routeOptions.url)) return;

    try {
      await req.jwtVerify();

    } catch (err: any) {
      fastify.log.error(err.message);
      res.status(401).send({ msg: "Unauthorized."});
    }
  })
};

export default app;