import fastify from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createQuestionSchema } from "../schemas/questionSchema";

const questionRoute: FastifyPluginAsyncZod = async (fastify, options) => {

    fastify.post("/", { schema: createQuestionSchema }, async (req, res) => {
        
    })
}