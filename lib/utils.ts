import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const preBuiltElements = [
  {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
    defaultField: {
      fieldType: 'text',
      fieldLabel: 'Text Field',
      placeholder: 'Enter text...',
      required: false,
      validation: 'nonEmpty'
    }
  },
  {
    type: 'email',
    label: 'Email Input',
    icon: '📧',
    defaultField: {
      fieldType: 'email',
      fieldLabel: 'Email Address',
      placeholder: 'Enter email...',
      required: true,
      validation: 'email'
    }
  },
  {
    type: 'tel',
    label: 'Phone Input',
    icon: '📞',
    defaultField: {
      fieldType: 'tel',
      fieldLabel: 'Phone Number',
      placeholder: 'Enter phone...',
      required: false,
      validation: 'phone'
    }
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: '📄',
    defaultField: {
      fieldType: 'textarea',
      fieldLabel: 'Message',
      placeholder: 'Enter your message...',
      required: false,
      validation: 'nonEmpty'
    }
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: '📋',
    defaultField: {
      fieldType: 'select',
      fieldLabel: 'Select Option',
      placeholder: 'Choose an option...',
      required: false,
      validation: 'nonEmpty',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: '🔘',
    defaultField: {
      fieldType: 'radio',
      fieldLabel: 'Choose One',
      required: false,
      validation: 'nonEmpty',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: '☑️',
    defaultField: {
      fieldType: 'checkbox',
      fieldLabel: 'Select Multiple',
      required: false,
      validation: 'nonEmpty',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'number',
    label: 'Number Input',
    icon: '🔢',
    defaultField: {
      fieldType: 'number',
      fieldLabel: 'Number',
      placeholder: 'Enter number...',
      required: false,
      validation: 'number'
    }
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: '📅',
    defaultField: {
      fieldType: 'date',
      fieldLabel: 'Date',
      required: false,
      validation: 'date'
    }
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: '📎',
    defaultField: {
      fieldType: 'file',
      fieldLabel: 'Upload File',
      required: false,
      validation: 'file'
    }
  }
]