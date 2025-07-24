import fastify, { FastifyPluginAsync } from "fastify";

interface User {
    id: number;
    name: string;
    email: string;

};

interface ErrorResponse {
    error: string;

}

const userRoutes: FastifyPluginAsync = async (fastify, options) => {
    const db = fastify.db;

    const createUserSchema = {
        body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
        }
        },
        response: {
        201: {
            type: 'object',
            properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' }
            }
        }
        }
    };

    const getUserByIdSchema = {
        params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'integer', minimum: 1 }
        }
        },
        response: {
        200: {
            type: 'object',
            properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' }
            }
        },
        404: {
            type: 'object',
            properties: {
            error: { type: 'string' }
            }
        }
        }
    };

    fastify.get("/users", async (request, reply) => {
        try {
            const users: User[] = db.prepare(`SELECT * FROM users`).all() as User[];
            return reply.send(users);

        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to retrieve users"});

        }
    })

    fastify.get<{ Params: { id: number }}, { Reply: User | ErrorResponse}>("/users/:id", { schema: getUserByIdSchema }, async (request, reply) => {
        try {
            const { id } = request.params;
            const user: User | undefined = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
            
            if (!user) {
                return reply.status(404).send( { error: "User not found"} as ErrorResponse);
            }

            return reply.send(user);
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send( { error: "Failed to retrieve users"} as ErrorResponse);
        }
    });

    fastify.post<{Body: Omit< User, "id"> }, {Reply: User}>("/users", { schema: createUserSchema}, async (req, res) => {
        try {
            const { name, email } = req.body;

            const stmt = db.prepare(`INSERT INTO users(name, email) VALUES(?, ?)`);
            const info = stmt.run(name, email); 
            const newUser: User = { id: info.lastInsertRowid as number, name, email };
            return res.status(201).send(newUser);
        } catch (err: any) { 
            fastify.log.error(err); 
            
            if (err.message && err.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
                return res.status(409).send({error: "Email already exists"} as ErrorResponse);
            }
            
            return res.status(500).send({error: "Failed to create user"} as ErrorResponse);
        }
    });
}

export default userRoutes;