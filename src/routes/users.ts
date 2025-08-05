import { getUserByIdSchema } from "../schemas/userSchemas"
import type { ErrorResponse } from "../types/types";
import type { User } from "../schemas/userSchemas";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const userRoutes: FastifyPluginAsyncZod = async (fastify, options) => {
    const db = fastify.db;

    fastify.get("/", async (req, res) => {
        try {
            const users: User[] = await fastify.getAllUsers();
            return res.status(200).send(users);

        } catch (err) {
            fastify.log.error(err);
            return res.status(500).send({ error: "Failed to retrieve users"});

        }
    })

    fastify.get("/:id", { schema: getUserByIdSchema }, async (req, res) => {
        try {
            const { id } = req.params;
            const user = await fastify.findUserById(parseInt(id));
            
            if (!user) {
                return res.status(404).send( { error: "User not found"} as ErrorResponse);
            }

            return res.status(200).send({ username: user.username, email: user.email, id: user.id });

        } catch (err) {
            fastify.log.error(err);
            return res.status(500).send( { error: "Failed to retrieve users"} as ErrorResponse);
            
        }
    });

}

export default userRoutes;