"use server"
import { db } from '@/drizzle/db';
import { formTable, formResponseTable, userTable } from '@/drizzle/schema';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { eq, desc, and, count } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';

export const CreateForm = async(userInput: string, isMultiStep: boolean = false) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const prompt = isMultiStep ? getMultiStepPrompt(userInput) : getSingleStepPrompt(userInput);
    
    const text = await generateText({
      model: groq('openai/gpt-oss-120b'),
      prompt
    });

    const raw = text.text ?? text.content ?? '';
    const parse = JSON.parse(raw);
    
    const savetoDb = await db.insert(formTable).values({
      userId: userId,
      form: parse,
      isMultiStep: isMultiStep,
      title: parse.formTitle || 'Untitled Form',
      description: parse.formSubheading || '',
      isPublished: false
    }).returning();
    
    return { success: true, data: savetoDb[0] };
  } catch (error: any) {
    console.error('Error creating form:', error);
    return { success: false, error: error.message };
  }
};

export const updateForm = async(formId: string, formData: any, title?: string, description?: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await db
      .update(formTable)
      .set({
        form: formData,
        title: title || formData.formTitle || 'Untitled Form',
        description: description || formData.formSubheading || '',
        updatedAt: new Date()
      })
      .where(and(eq(formTable.id, formId), eq(formTable.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: 'Form not found or unauthorized' };
    }

    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error updating form:', error);
    return { success: false, error: error.message };
  }
};

export const publishForm = async(formId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await db
      .update(formTable)
      .set({
        isPublished: true,
        updatedAt: new Date()
      })
      .where(and(eq(formTable.id, formId), eq(formTable.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: 'Form not found or unauthorized' };
    }

    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error publishing form:', error);
    return { success: false, error: error.message };
  }
};

export const unpublishForm = async(formId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await db
      .update(formTable)
      .set({
        isPublished: false,
        updatedAt: new Date()
      })
      .where(and(eq(formTable.id, formId), eq(formTable.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: 'Form not found or unauthorized' };
    }

    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error unpublishing form:', error);
    return { success: false, error: error.message };
  }
};

export const submitFormResponse = async(formId: string, responseData: any, submitterEmail?: string, submitterName?: string) => {
  try {
    console.log('submitFormResponse called with:', { formId, responseData, submitterEmail, submitterName });

    // Validate input
    if (!formId) {
      return { success: false, error: 'Form ID is required' };
    }

    if (!responseData || Object.keys(responseData).length === 0) {
      return { success: false, error: 'Response data is required' };
    }

    // Check if form exists and is published
    console.log('Checking if form exists and is published...');
    const form = await db
      .select()
      .from(formTable)
      .where(eq(formTable.id, formId))
      .limit(1);

    console.log('Form query result:', form);

    if (form.length === 0) {
      return { success: false, error: 'Form not found' };
    }

    if (!form[0].isPublished) {
      return { success: false, error: 'Form is not published' };
    }

    console.log('Form is valid and published, inserting response...');

    const result = await db.insert(formResponseTable).values({
      formId: formId,
      responseData: responseData,
      submitterEmail: submitterEmail,
      submitterName: submitterName
    }).returning();

    console.log('Response inserted successfully:', result);

    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error submitting form response:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

export const getUserForms = async() => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const forms = await db
      .select({
        id: formTable.id,
        title: formTable.title,
        description: formTable.description,
        isPublished: formTable.isPublished,
        isMultiStep: formTable.isMultiStep,
        createdAt: formTable.createdAt,
        updatedAt: formTable.updatedAt,
        responseCount: count(formResponseTable.id)
      })
      .from(formTable)
      .leftJoin(formResponseTable, eq(formTable.id, formResponseTable.formId))
      .where(eq(formTable.userId, userId))
      .groupBy(formTable.id)
      .orderBy(desc(formTable.updatedAt));

    return { success: true, data: forms };
  } catch (error: any) {
    console.error('Error fetching user forms:', error);
    return { success: false, error: error.message };
  }
};

export const getFormResponses = async(formId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify user owns the form
    const form = await db
      .select()
      .from(formTable)
      .where(and(eq(formTable.id, formId), eq(formTable.userId, userId)))
      .limit(1);

    if (form.length === 0) {
      return { success: false, error: 'Form not found or unauthorized' };
    }

    const responses = await db
      .select()
      .from(formResponseTable)
      .where(eq(formResponseTable.formId, formId))
      .orderBy(desc(formResponseTable.submittedAt));

    return { success: true, data: responses };
  } catch (error: any) {
    console.error('Error fetching form responses:', error);
    return { success: false, error: error.message };
  }
};

export const getDashboardStats = async() => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const [formsCount] = await db
      .select({ count: count() })
      .from(formTable)
      .where(eq(formTable.userId, userId));

    const [publishedFormsCount] = await db
      .select({ count: count() })
      .from(formTable)
      .where(and(eq(formTable.userId, userId), eq(formTable.isPublished, true)));

    const [totalResponsesCount] = await db
      .select({ count: count() })
      .from(formResponseTable)
      .innerJoin(formTable, eq(formTable.id, formResponseTable.formId))
      .where(eq(formTable.userId, userId));

    return {
      success: true,
      data: {
        totalForms: formsCount.count,
        publishedForms: publishedFormsCount.count,
        totalResponses: totalResponsesCount.count
      }
    };
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: error.message };
  }
};

export const syncUser = async() => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, user.id))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(userTable).values({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl
      });
    } else {
      await db
        .update(userTable)
        .set({
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          updatedAt: new Date()
        })
        .where(eq(userTable.id, user.id));
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return { success: false, error: error.message };
  }
};

export const getAllForm = async() => {
  try {
    const result = await db.select().from(formTable);
    console.log(result);
    
    if (result.length === 0) {
      return { success: false, error: "No forms found" };
    }
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error fetching forms:', error);
    return { success: false, error: error.message };
  }
};

export const getFormById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(formTable)
      .where(eq(formTable.id, id));
    
    if (result.length === 0) {
      return { success: false, error: "Form not found" };
    }
    
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("Error fetching form by id:", error);
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