export interface SignInFormContext {
    email: string;
    password: string;
    isDisabled: boolean;
    error?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    user?:any
  }
  
  export type UpdateFieldEvent = {
    type: 'UPDATE_FIELD';
    field: keyof SignInFormContext;
    value: string;
  };
  
  export type SubmitEvent = {
    type: 'SUBMIT';
  };
  
  export type SignInFormEvent = UpdateFieldEvent | SubmitEvent;