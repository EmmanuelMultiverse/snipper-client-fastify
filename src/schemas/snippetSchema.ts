import { z } from "zod";

const snippetSchema = z.object({
    id: z.string(),
    questionId: z.string(),
    language: z.string(),
    codeSnippet: z.string()
})

export const createSnippetSchema = {
    body: snippetSchema.omit({id: true}),
    response: {
        201: z.object({
            msg: z.string(),
        }),
        500: z.object({
            msg: z.string(),
        })
    }
}

export const getAllSnippetsSchema = {
    querystring: z.object({
        questionId: z.string().optional(),

    }),
    response: {
        200: z.array(snippetSchema),
        500: z.object({
            msg: z.string(),

        })
    }
}

export const getSnippetByIdSchema = {
    params: z.object({
        id: z.string(),
    }),
    response: {
        200: snippetSchema,
        404: z.object({
            msg: z.string(),
        }),
        500: z.object({
            msg: z.string(),
        }),
    }
}

export type Snippet = z.infer<typeof snippetSchema>;