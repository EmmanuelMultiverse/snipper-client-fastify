
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import dbPlugin from './plugins/db-plugin';
import userDecorators from './plugins/userDecorators';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import fastJWT from "@fastify/jwt";

const app: FastifyPluginAsync = async (fastify, opts) => {

  const publicRoutes = ["/auth/login", "/auth/register"];

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new Error("JWT_SECRET must be defined.");
  
  await fastify.register(dbPlugin, {
    filename: "db.sqlite"
  })

  await fastify.register(userDecorators);

  await fastify.register(fastJWT, {
    secret: jwtSecret,

  });

  await fastify.register(authRoutes, {
    prefix: "/auth"
  })

  await fastify.register(userRoutes, {
    prefix: "/users"
  });

  fastify.addHook("preValidation", async (req: FastifyRequest, res: FastifyReply) => {

    if (req.routeOptions.url && publicRoutes.includes(req.routeOptions.url)) return;

    try {
      await req.jwtVerify();

    } catch (err: any) {
      res.status(401).send({ msg: "Unauthorized."});
    }
  })
};

export default app;