import fastify, { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { User  } from "../schemas/userSchemas";

declare module "fastify" {
    interface FastifyInstance {
        findUserById(id: number): User | undefined;
        findUserByUsername(username: string): User | undefined;
        createUser(user: Omit<User, "id">): number;
    }
}

const userDecorators: FastifyPluginAsync = async (fastify) => {
    fastify.decorate("findUserById", (id: number) => {
        return fastify.db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
    })

    fastify.decorate("findUserByUsername", (username: string) => {
        return fastify.db.prepare("SELECT * FROM users WHERE username = ?").get(username) as User | undefined;
    })

    fastify.decorate("createUser", (user: Omit<User, "id">) => {
        const stmt = fastify.db.prepare("INSERT INTO users(username, email, password) VALUES(?, ?, ?)");
        const info = stmt.run(user.username, user.email, user.password);
        return info.lastInsertRowid;
    })
}

export default fastifyPlugin(userDecorators,
    {
        name: "user-decorators"
    }
);