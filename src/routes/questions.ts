import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createQuestionSchema, getAllQuestionsSchema, getQuestionSchema } from "../schemas/questionSchema";

const questionRoute: FastifyPluginAsyncZod = async (fastify, options) => {

    fastify.post("/", { schema: createQuestionSchema }, async (req, res) => {
        try {
            const question = req.body;
            const id = await fastify.createQuestion(question); 
            return res.status(201).send({ msg: `Created Successfully: ${id}`});
        
        } catch (err: any) {
            return res.status(500).send({ msg: "Couldnt not create question"});
        }
    })

    fastify.get("/", { schema: getAllQuestionsSchema }, async (req, res) => {

        try {
            const questions = await fastify.findAllQuestions();

            return res.status(200).send(questions);
        } catch (err: any) {
            fastify.log.error(err);
            return res.status(500).send({ msg: "Database Error!"});
        }
    })

    fastify.get("/:id", { schema: getQuestionSchema}, async (req, res) => {
        try {

            const { id } = req.params;

            const question = await fastify.findQuestionById(parseInt(id));

            if (question === null) return res.status(404).send({ msg: "Could not find question"});

            res.status(200).send(question);
        } catch (err: any) {
            return res.status(500).send({ msg: "Database Error!"});
        }
    })
}

export default questionRoute;