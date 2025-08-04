import { z } from "zod";

const authSchema = z.object({
    username: z.string(),
    email: z.email(),
    password: z.string(),
})

export const loginSchema = {
    body: authSchema.omit({ email: true }),
    response: {
        200: z.object({
            token: z.string()
        }),
        500: z.object({
            error: z.string()
        })
    }
}

export const registerSchema = {
    body: authSchema,
    response: {
        201: z.object({
            id: z.number().int().positive()
        }),
        500: z.object({
            error: z.string(),
        })
    }
}