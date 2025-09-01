import { boolean, jsonb, pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const formTable = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID
  form: jsonb('forms').notNull(),
  isMultiStep: boolean("is_multi_step").default(false),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formResponseTable = pgTable("form_response", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").references(() => formTable.id, { onDelete: "cascade" }).notNull(),
  responseData: jsonb("response_data").notNull(), // Store form field responses
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  submitterEmail: varchar("submitter_email", { length: 255 }), // Optional email of person who filled form
  submitterName: varchar("submitter_name", { length: 255 }), // Optional name of person who filled form
});

export const userTable = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk user ID
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});