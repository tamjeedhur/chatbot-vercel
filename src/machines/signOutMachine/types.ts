export interface SignOutMachineContext {
  error: string | null;
  isLoading: boolean;
}

export type SignOutMachineEvent = 
  | { type: 'SIGN_OUT'; refreshToken: string }
  | { type: 'RESET' }
  | { type: 'error'; error: string };

export interface SignOutApiResponse {
  success: boolean;
  message: string;
}

export interface SignOutApiError {
  success: false;
  message: string;
  code?: string;
}
