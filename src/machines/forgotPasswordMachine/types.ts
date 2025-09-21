export interface ResetPasswordContext {
  email: string;
  isDisabled: boolean;
  isEmailSent: boolean;
  error: string | null;
}

export type UpdateFieldEvent = {
  type: 'UPDATE_FIELD';
  value: string;
};
export type SubmitEvent = {
  type: 'SUBMIT';
};
export type ResendEvent = {
  type: 'RESEND';
};
export type ResetEvent = {
  type: 'RESET';
};

export type ResetPasswordEvent = UpdateFieldEvent | SubmitEvent | ResendEvent | ResetEvent;