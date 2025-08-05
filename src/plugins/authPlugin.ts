import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

const authPlugin: FastifyPluginAsync = async (fastify, options) => {

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
  };

  fastify.decorate('authenticate', authenticate);
};

export default fastifyPlugin(authPlugin);