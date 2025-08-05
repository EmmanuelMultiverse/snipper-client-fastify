import { z } from "zod";

const questionSchema = z.object({
    id: z.number().int().positive(),
    text: z.string(),

})

export const createQuestionSchema = {
    body: questionSchema.omit({ id: true}),
    response: {
        201: z.object({
            msg: z.string(),
        })
    }
}

export const getQuestionSchema = {
    params: z.object({
        id: z.number().int().positive(),

    }),
    response: {
        200: questionSchema,
        404: z.object({
            msg: z.string(),

        })   
    }
}


export type Question = z.infer<typeof questionSchema>;