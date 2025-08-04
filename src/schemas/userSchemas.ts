import { z } from "zod"

const userSchema = z.object({
    id: z.number().int().positive(),
    username: z.string(),
    email: z.email(),
    password: z.string(),
})

export const createUserSchema = {
    body: userSchema.pick({ username: true, email: true, password: true}),
    response: {
        201: z.object({
            id: z.number().int(),
        })
    }
}

export const getUserByIdSchema = {
    params: z.object({
        id: z.number().int().positive(),
    }),
    response: {
        200: userSchema.omit({ password: true }),
        404: z.object({
            error: z.string(),
        })
    }
}

export type User = z.infer<typeof userSchema>;
