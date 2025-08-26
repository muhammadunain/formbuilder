export interface PropsLayout {
    children:React.ReactNode
}


export interface FormField {
  fieldId: string;       
  fieldType: string;    
  fieldName: string;     
  fieldLabel: string;   
  placeholder: string;   
  required: boolean;     
  validation: string;    
  options?: string[];  
}

export interface FormType {
  formTitle: string;     
  formSubheading: string;
  formFields: FormField[];
}

