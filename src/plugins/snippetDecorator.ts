import fastify, { FastifyPluginAsync } from "fastify";
import { createSnippetSchema, Snippet } from "../schemas/snippetSchema";
import fastifyPlugin from "fastify-plugin";
import { FindAllSnippetsOptions } from "../types/types";

declare module "fastify" {
    interface FastifyInstance {
        createSnippet(snippet: Omit<Snippet, "id">): Promise<bigint>;
        findSnippetById(id: number): Promise<Snippet | null>;
        findAllSnippets(options?: { questionId?: number }): Promise<Snippet[]>;
    }
}

const snippetDecorator: FastifyPluginAsync = async (fastify, options) => {

    fastify.decorate("createSnippet", async (question: Omit<Snippet, "id">) => {
        const id = await fastify.db
                    .insertInto("snippets")
                    .values({
                        questionId: parseInt(question.questionId),
                        language: question.language,
                        codeSnippet: question.codeSnippet
                    })
                    .executeTakeFirst();
        
        if (id && id.insertId) return id.insertId;

        throw new Error("Could not create snippet, error at ID retrieval");
    })

    fastify.decorate("findSnippetById", async (id: number) => {
        const snippet = await fastify.db
                        .selectFrom("snippets")
                        .selectAll()
                        .where("id", "=", id)
                        .executeTakeFirst();
        
        if (snippet) {
            const foundSnippet = {
                ...snippet,
                id: snippet.id.toString(),
                questionId: snippet.questionId.toString(),
            }

            return foundSnippet;
        }
        
        return null;
    })

    fastify.decorate("findAllSnippets", async (options?: FindAllSnippetsOptions) => {
        
        let query = fastify.db
                    .selectFrom("snippets")
                    .selectAll()
        
        if (options?.questionId) {
            query = query.where("questionId", "=", options.questionId);
        }

        const snippets = await query.execute();
        
        return snippets.map(s => ({...s, id: s.id.toString(), questionId: s.questionId.toString()}));
    })

}

export default fastifyPlugin(snippetDecorator,
    {
        name: "snippets-decorator",

    }
);