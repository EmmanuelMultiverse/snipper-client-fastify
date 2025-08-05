import { registerSchema, loginSchema } from "../schemas/authSchemas";
import bcrypt from "bcrypt";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const authRoutes: FastifyPluginAsyncZod = async (fastify, options) => {
    
    const db = fastify.db;

    fastify.post("/register", {schema: registerSchema}, async (req, res) => {
        try {
            const { username, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const info = fastify.createUser({username, email, password: hashedPassword}); 
            return res.status(201).send({ id: info });

        } catch (err: any) {

            if (err.message) {
                if (err.message.includes("users.email")) {
                    return res.status(409).send({ error: "Email already exists"});
                }

                if (err.message.includes("users.username")) {
                    return res.status(409).send({ error: "Username already exists"});
                }
            }

            return res.status(500).send({ error: "Failed to create user"});
        }
    });

    fastify.post("/login", { schema: loginSchema }, async (req, res) => {
        try {
            const { username, password } = req.body;
            
            const user = fastify.findUserByUsername(username);

            if (user) {
                const correctPassword = await bcrypt.compare(password, user.password);
                if (correctPassword) {

                    const token = fastify.jwt.sign({ username, id: user.id, roles: ["user"]});

                    return res.status(200).send({ token, msg: "Login Successful!" });
                } else {
                    return res.status(403).send({ error: "Incorrect Password!"});
                }

            } else {
                res.status(404).send({ error: "Could not find user"});
            }

        } catch (err: any) {

            res.status(500).send({ error: "Internal server error"});
        }
    });

}

export default authRoutes;