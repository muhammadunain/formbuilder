"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Field = {
  fieldId: string;
  fieldType: string;
  fieldLabel: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
};

type Step = {
  stepId: string;
  stepTitle: string;
  stepDescription?: string;
  formFields: Field[];
};

type Schema = {
  formTitle: string;
  formSubheading: string;
  formFields?: Field[]; // single-step
  steps?: Step[]; // multi-step
};

export default function FormPreview({ schema }: { schema: Schema }) {
  const [step, setStep] = useState(0);

  // 🔥 Normalize fields depending on schema type
  const fields =
    schema?.formFields ??
    (schema?.steps ? schema.steps[step]?.formFields : []);

  if (!fields || fields.length === 0) {
    return <p className="text-center text-gray-500">No form fields available.</p>;
  }

  const totalSteps = schema?.steps ? schema.steps.length : 1;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold">{schema.formTitle}</h1>
      <p className="text-gray-600">{schema.formSubheading}</p>

      {/* Progress bar for multi-step */}
      {schema.steps && (
        <Progress value={progress} className="h-2 rounded-full" />
      )}

      <form className="space-y-4">
        {fields.map((field) => (
          <div key={field.fieldId} className="space-y-2">
            <Label htmlFor={field.fieldId}>{field.fieldLabel}</Label>

            {field.fieldType === "text" ||
            field.fieldType === "email" ||
            field.fieldType === "number" ? (
              <Input
                id={field.fieldId}
                type={field.fieldType}
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : field.fieldType === "select" ? (
              <select
                id={field.fieldId}
                className="w-full border rounded-md p-2"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}

        {/* Navigation buttons */}
        {schema.steps ? (
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              Previous
            </Button>

            {step < totalSteps - 1 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </div>
  );
}
