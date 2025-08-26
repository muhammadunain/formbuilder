import { NextRequest, NextResponse } from "next/server";
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
export async function POST(req:NextRequest) {
const {userInput} = await req.json();
    try{
const text = await generateText({
    model:groq('openai/gpt-oss-120b'),
      prompt: `
You are an expert form builder that generates ONLY valid JSON.

Analyze the following user request and return a complete web form definition.

User Request: "${userInput}"

Output requirements:
- Return ONLY valid JSON (no explanations, no markdown, no extra text).
- The JSON must be parseable with JSON.parse in JavaScript.
- The "formFields" property MUST be an array of field objects.

Output format example:
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
const parsed = JSON.parse(raw)
return NextResponse.json(parsed)
    }catch (error: any) {
    console.error("Error in create-form route:", error);
    return NextResponse.json(
      { error: "Failed to generate form definition" },
      { status: 500 }
    );
  }
    
}