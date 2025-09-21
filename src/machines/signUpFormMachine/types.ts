export interface SignUpFormContext {
  email: string;
  password: string;
  name: string;
  role: string;
  isDisabled: boolean;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  user?:any
}

export type UpdateFieldEvent = {
  type: 'UPDATE_FIELD';
  field: keyof SignUpFormContext;
  value: string;
};

export type SubmitEvent = {
  type: 'SUBMIT';
};

export type SignUpFormEvent = UpdateFieldEvent | SubmitEvent;