"use server"
import { db } from '@/drizzle/db';
import { formTable, formResponseTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export const submitFormResponse = async(formId: string, responseData: any, submitterEmail?: string, submitterName?: string) => {
  try {
    console.log('submitFormResponse called with:', {
      formId,
      responseData,
      submitterEmail,
      submitterName
    });

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