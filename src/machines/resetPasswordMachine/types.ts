export interface ResetPasswordContext {
  password?: string;
  confirmPassword?: string;
  token?: string;
  error?: string | null;
}

export type ResetPasswordEvent = 
  | { type: 'SUBMIT'; }
  
  | { type: 'EDIT_PASSWORD'; password: string; }
  | { type: 'EDIT_CONFIRM_PASSWORD'; confirmPassword: string; };