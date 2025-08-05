import { KyselyDatbase } from "./types/types";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

const dialect = new SqliteDialect({
    database: new Database(":memory:"),
});

export const db = new Kysely<KyselyDatbase>({
    dialect,

})