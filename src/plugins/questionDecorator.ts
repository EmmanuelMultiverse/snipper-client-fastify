import fastify, { FastifyPluginAsync } from "fastify";
import { Question } from "../schemas/questionSchema";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
    interface FastifyInstance {
        createQuestion(question: Omit<Question, "id">): Promise<number | bigint>;
        findQuestionById(id: number): Promise<Question | null>;
        findAllQuestions(): Promise<Question[]>;
    }
}

const questionDecorator: FastifyPluginAsync = async (fastify, options) => {

    fastify.decorate("findAllQuestions", async () => {
        const res = await fastify.db
                    .selectFrom("questions")
                    .selectAll()
                    .execute()
        
        return res.map(q => ({...q, id: q.id.toString()}));
    })

    fastify.decorate("findQuestionById", async (id: number) => {
        const res = await fastify.db
                    .selectFrom("questions")
                    .selectAll()
                    .where("id", "=", id)
                    .executeTakeFirst()
        
        if (res) {
            const foundQuestion = {
                ...res,
                id: res.id.toString()
            }
            return foundQuestion;
        };

        return null;
    })
    
    fastify.decorate("createQuestion", async (question) => {
        const res = await fastify.db.insertInto("questions").values({ text: question.text }).executeTakeFirst();
        
        if (res && res.insertId) return res.insertId;

        throw new Error("Could not create question, issue at retrieving id");
    })
}

export default fastifyPlugin(questionDecorator,
    {
        name: "question-decorator"
    }
)