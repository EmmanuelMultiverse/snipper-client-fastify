import { z } from "zod";

const questionSchema = z.object({
    id: z.string(),
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

export const getAllQuestionsSchema = {
    response: {
        200: z.array(questionSchema),
        404: z.object({
            msg: z.string(),
        })
    }
}

export const getQuestionSchema = {
    params: z.object({
        id: z.string(),

    }),
    response: {
        200: questionSchema,
        404: z.object({
            msg: z.string(),

        })   
    }
}


export type Question = z.infer<typeof questionSchema>;