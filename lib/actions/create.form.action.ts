"use server"
import { db } from '@/drizzle/db';
import { formTable } from '@/drizzle/schema';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { eq } from 'drizzle-orm';

export const CreateForm = async(userInput: string, isMultiStep: boolean = false) => {
  try {
    const prompt = isMultiStep ? getMultiStepPrompt(userInput) : getSingleStepPrompt(userInput);
    
    const text = await generateText({
      model: groq('openai/gpt-oss-120b'),
      prompt
    });

    const raw = text.text ?? text.content ?? '';
    const parse = JSON.parse(raw);
    
    const savetoDb = await db.insert(formTable).values({
      form: parse,
      isMultiStep: isMultiStep
    }).returning();
    
    return { success: true, data: savetoDb[0] };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

const getSingleStepPrompt = (userInput: string) => `
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
}`;

const getMultiStepPrompt = (userInput: string) => `
You are an expert form builder that generates ONLY valid JSON for multi-step forms.
Analyze the following user request and return a complete multi-step web form definition.

User Request: "${userInput}"

Output rules:
- Return ONLY valid JSON (no explanations, no markdown).
- The JSON must be parseable with JSON.parse in JavaScript.
- Create logical steps that group related fields together.
- Each step should have 3-7 fields maximum for better UX.
- "steps" must be an array of step objects.
- Each step must have: stepId, stepTitle, stepDescription, and formFields array.
- If the fieldType is "select", "radio", or "checkbox":
  - Always generate at least 3 realistic, context-aware options.
- If the fieldType is "text", "email", "tel", "number", or "date":
  - options must always be [].
- Always provide helpful placeholder text.
- The last step should include a "submit" button as the final field.
- Submit button format:
  {
    "fieldId": "submit",
    "fieldType": "button",
    "fieldName": "submit",
    "fieldLabel": "Submit Form",
    "placeholder": "",
    "required": false,
    "validation": "",
    "options": []
  }

Output format:
{
  "formTitle": "Form title",
  "formSubheading": "Brief description of form purpose",
  "isMultiStep": true,
  "totalSteps": 3,
  "steps": [
    {
      "stepId": "step_1",
      "stepTitle": "Step 1 Title",
      "stepDescription": "Brief description of this step",
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
  ]
}`;

export const getAllForm = async() => {
  try {
    const result = await db.select().from(formTable);
    console.log(result);
    
    if (result.length === 0) {
      throw new Error("No forms found");
    }
    
    return { success: true, data: result };
  } catch (error: any) {
    throw new Error('Error fetching forms', error);
  }
};

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