import Database from "better-sqlite3";
import { FastifyPluginAsync } from "fastify";
import path from "path";
import fastifyPlugin from "fastify-plugin";

interface DbPluginOptions {
    filename: string;
}

const dbPlugin: FastifyPluginAsync<DbPluginOptions> = async (fastify, opts) => {

    const dbPath = path.join(__dirname, "..", opts.filename);
    const db = new Database(dbPath);

    db.pragma("journal_mode = WAL");

    fastify.decorate("db", db);

    try {
        // ask about last comma in sql statement
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
        )`);
        fastify.log.info("Database table 'users' ensured");
    } catch (err) {
        fastify.log.error("Failed to initialize datbase: ", err);
        process.exit(1);
    }

    fastify.addHook("onClose", (instance, done) => {
        fastify.db.close();
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