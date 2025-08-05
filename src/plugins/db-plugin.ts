import Database from "better-sqlite3";
import { FastifyPluginAsync } from "fastify";
import path from "path";
import fastifyPlugin from "fastify-plugin";
import { Kysely, SqliteDialect } from "kysely";
import { KyselyDatbase } from "../types/types";

interface DbPluginOptions {
    filename: string;
}

const dbPlugin: FastifyPluginAsync<DbPluginOptions> = async (fastify, opts) => {

    const dbPath = path.join(__dirname, "..", opts.filename);
    const db = new Database(dbPath);

    db.pragma("journal_mode = WAL");

    const dialect = new SqliteDialect({
        database: db,
    })

    const kyselyDB = new Kysely<KyselyDatbase>({
        dialect,
    })

    fastify.decorate("db", kyselyDB);

    try {

        await kyselyDB.schema
            .createTable("users")
            .ifNotExists()
            .addColumn("id", "integer", (col) => 
                col.primaryKey().autoIncrement()
            )
            .addColumn("username", "text", (col) => col.unique().notNull())
            .addColumn("email", "text", (col) => col.unique().notNull())
            .addColumn("password", "text", (col) => col.notNull())
            .execute();
        
        fastify.log.info("Database table 'users' ensured");
        
        await kyselyDB.schema
            .createTable("questions")
            .ifNotExists()
            .addColumn("id", "integer", (col) => 
                col.primaryKey().autoIncrement()
            )
            .addColumn("text", "text", (col) => col.notNull())
            .execute()

        await kyselyDB.schema
            .createTable("snippets")
            .ifNotExists()
            .addColumn("id", "integer", (col) => 
                col.primaryKey().autoIncrement()
            )
            .addColumn("questionId", "integer", (col) => 
                col.references("questions.id").onDelete("cascade").notNull()
            )
            .addColumn("language", "text", (col) => 
                col.notNull()
            )
            .addColumn("codeSnippet", "text", (col) => 
                col.notNull()
            )
            .execute()
        
        fastify.log.info("Database table 'questions' ensured");

    } catch (err) {
        fastify.log.error("Failed to initialize datbase: ", err);
        process.exit(1);
    }

    fastify.addHook("onClose", (instance, done) => {
        db.close();
        fastify.log.info("Better-sqlite3 datbase connection closed.");
        done();
    });
};

export default fastifyPlugin(
    dbPlugin,
    {
        name: "db-plugin",

    }
)