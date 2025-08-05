
import { Kysely } from "kysely";
import { KyselyDatbase } from "./types";

declare module "fastify" {
    interface FastifyInstance {
        db: Kysely<KyselyDatbase>;
    }
}