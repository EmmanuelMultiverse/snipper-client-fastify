import { z } from "zod";

const snippetSchema = z.object({
    id: z.string(),
    questionId: z.string(),
    language: z.string(),
    codeSnippet: z.string()
})

const createSnippetSchema = {
    body: snippetSchema,
    response: {
        201: {
            msg: z.string(),
        },
        500: {
            msg: z.string()
        }
    }
}

const getAllSnippetsSchema = {
    response: {
        200: z.array(snippetSchema),
        500: {
            msg: z.string()
        }
    }
}

const getSnippetByIdSchema = {
    params: {
        id: z.string(),
    },
    response: {
        200: snippetSchema,
        404: { msg: z.string() },
        500: { msg: z.string() },
    }
}