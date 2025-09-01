import { relations } from "drizzle-orm/relations";
import { formResponseTable, formTable } from "./schema";

export const formResponseRelations = relations(formResponseTable, ({one}) => ({
	form: one(formTable, {
		fields: [formResponseTable.formId],
		references: [formTable.id]
	}),
}));

export const formRelations = relations(formTable, ({many}) => ({
	formResponses: many(formResponseTable),
}));