import { getUserByIdSchema } from "../schemas/userSchemas"
import type { ErrorResponse } from "../types";
import type { User } from "../schemas/userSchemas";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const userRoutes: FastifyPluginAsyncZod = async (fastify, options) => {
    const db = fastify.db;

    fastify.get("/", async (req, res) => {
        try {
            const users: User[] = db.prepare(`SELECT * FROM users`).all() as User[];
            return res.send(users);

        } catch (err) {
            fastify.log.error(err);
            return res.status(500).send({ error: "Failed to retrieve users"});

        }
    })

    fastify.get("/:id", { schema: getUserByIdSchema }, async (req, res) => {
        try {
            const { id } = req.params;
            const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
            
            if (!user) {
                return res.status(404).send( { error: "User not found"} as ErrorResponse);
            }

            return res.send(user);

        } catch (err) {
            fastify.log.error(err);
            return res.status(500).send( { error: "Failed to retrieve users"} as ErrorResponse);
            
        }
    });

}

export default userRoutes;