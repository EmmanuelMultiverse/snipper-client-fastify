import fastify, { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { User } from "../schemas/userSchemas";

declare module "fastify" {
    interface FastifyInstance {
        getAllUsers(): Promise<User[]>;
        findUserById(id: number): Promise<User | undefined>;
        findUserByUsername(username: string): Promise<User | undefined>;
        createUser(user: Omit<User, "id">): Promise<number | bigint>;
    }
}

const userDecorator: FastifyPluginAsync = async (fastify) => {

    fastify.decorate("getAllUsers", async () => {
        
        const res = await fastify.db
                        .selectFrom("users")
                        .selectAll()
                        .execute()
        return res.map(u => ({ ...u, id: u.id.toString()}));
    })

    fastify.decorate("findUserById", async (id: number) => {
        const res = await fastify.db
                        .selectFrom("users")
                        .selectAll()
                        .where("id", "=", id)
                        .executeTakeFirst();
        if (res) {
            return {...res, id: res.id.toString()};
        }
    })

    fastify.decorate("findUserByUsername", async (username: string) => {
        const res = await fastify.db
                        .selectFrom("users")
                        .selectAll()
                        .where("username", "=", username)
                        .executeTakeFirst();
        
        if (res) {
            return {...res, id: res.id.toString()};
        }
    })

    fastify.decorate("createUser", async (user: Omit<User, "id">) => {

        const res = await fastify.db
                        .insertInto("users")
                        .values({
                            username: user.username,
                            password: user.password,
                            email: user.email
                        })
                        .executeTakeFirst();


        if (res && res.insertId) return res.insertId;
            
        throw new Error("Failed to retrieve insertID from new user");
    })
}

export default fastifyPlugin(userDecorator,
    {
        name: "user-decorators"
    }
);