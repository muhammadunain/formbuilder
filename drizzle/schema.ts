import {  jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const formTable = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  form: jsonb('forms').notNull(),
  
});
