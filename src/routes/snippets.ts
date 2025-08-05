import fastify from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createSnippetSchema, getAllSnippetsSchema, getSnippetByIdSchema } from "../schemas/snippetSchema";
import { FindAllSnippetsOptions } from "../types/types";

const snippetsRoute: FastifyPluginAsyncZod = async (fastify, options) => {

    fastify.post("/", { schema: createSnippetSchema }, async (req, res) => {
        try {
            const snippet = req.body;

            const id = await fastify.createSnippet({ questionId: snippet.questionId, language: snippet.language, codeSnippet: snippet.codeSnippet});

            return res.status(201).send({ msg: `Created snippet: ${id}`});

        } catch (err: any) {
            fastify.log.error(err.message);
            return res.status(500).send({ msg: "Could not create snippet"});

        }
    })

    fastify.get("/:id", { schema: getSnippetByIdSchema }, async (req, res) => {
        try {
            const { id } = req.params;

            const snippet = await fastify.findSnippetById(parseInt(id));

            if (snippet === null) return res.status(404).send({ msg: `Could not find snippet: ${id}`});

            return res.status(200).send(snippet);

        } catch (err: any) {
            fastify.log.error(err.message);
            return res.status(500).send({ msg: "Server Error:"});
        
        }
    })

    fastify.get("/", { schema: getAllSnippetsSchema }, async (req, res) => {
        try {

            const { questionId } = req.query;

            const options: FindAllSnippetsOptions = {};

            if (questionId) options.questionId = parseInt(questionId);

            const snippets = await fastify.findAllSnippets(options);

            return res.status(200).send(snippets);
        
        } catch (err: any) {
            fastify.log.error(err.message);
            return res.status(500).send({ msg: "Server Error" });

        }
    })

}

export default snippetsRoute;