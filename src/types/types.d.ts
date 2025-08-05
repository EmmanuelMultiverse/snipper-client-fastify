export interface ErrorResponse {
    error: string;
}

import {
ColumnType,
Generated,
Insertable,
JSONColumnType,
Selectable,
Updateable,

} from "kysely"

export interface KyselyDatbase {
    users: UserTable;
    questions: QuestionTable;
}

export interface UserTable {
  id: Generated<number>;

  username: string;

  email: string;

  password: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdatedUser = Updateable<UserTable>;

export interface QuestionTable {
    id: Generated<number>;
    
    text: string;
}

export type Question = Selectable<QuestionTable>
export type NewQuestion = Insertable<QuestionTable>
export type UpdatedQuestion = Updateable<QuestionTable>
