"use server"
import { db } from '@/drizzle/db';
import { formTable } from '@/drizzle/schema';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { eq } from 'drizzle-orm';
export const CreateForm = async(userInput:string) => { 
try {
    const text = await generateText({
    model:groq('openai/gpt-oss-120b'),
     prompt: `
You are an expert form builder that generates ONLY valid JSON.

Analyze the following user request and return a complete web form definition.

User Request: "${userInput}"

Output rules:
- Return ONLY valid JSON (no explanations, no markdown).
- The JSON must be parseable with JSON.parse in JavaScript.
- "formFields" must be an array of objects.
- If the fieldType is "select", "radio", or "checkbox":
  - Always generate at least 3 realistic, context-aware options based on the field label and user request.
  - Example: If the field label is "Inquiry Type" for a Contact Form, options might be ["General Inquiry", "Support", "Sales", "Feedback"].
- If the fieldType is "text", "email", "tel", "number", or "date":
  - options must always be [].
- Always provide helpful placeholder text relevant to the field.
- Ensure fields are logically ordered and user-friendly.
- Always add a "submit" button field as the last item in "formFields".
- Submit button must use:
  {
    "fieldId": "submit",
    "fieldType": "button",
    "fieldName": "submit",
    "fieldLabel": "Submit",
    "placeholder": "",
    "required": false,
    "validation": "",
    "options": []
  }

Output format:
{
  "formTitle": "Form title",
  "formSubheading": "Brief description of form purpose",
  "formFields": [
    {
      "fieldId": "unique_field_id",
      "fieldType": "input_type",
      "fieldName": "camelCase_field_name",
      "fieldLabel": "Display label for users",
      "placeholder": "Helpful placeholder text",
      "required": true,
      "validation": "validation_rules",
      "options": ["array_of_options_if_applicable"]
    }
  ]
}
`




})
const raw = text.text?? text.content??''
const parse = JSON.parse(raw)
const savetoDb = await db.insert(formTable).values({form:parse}).returning()
return {success:true, data: savetoDb[0]}
} catch (error:any) {
    console.log(error)
  return {success:false, error:error.message}
}
 }


 export const  getAllForm = async() => { 
try {
  const result = await db.select().from(formTable)
  console.log(result)
  
    if (result.length === 0) {
      throw new Error("No forms found");
    }
    return{sucess:true,data:result}
} catch (error:any) {
  throw new Error('Error fetching forms',error)
}

 }



 export const getFormById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(formTable)
      .where(eq(formTable.id, id));

    if (result.length === 0) {
      throw new Error("Form not found");
    }

    return { success: true, data: result[0] }; 
  } catch (error: any) {
    console.error("Error fetching form by id:", error);
    return { success: false, error: error.message };
  }
};