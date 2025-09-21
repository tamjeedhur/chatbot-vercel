export interface VerifyEmailContext {
    token: string;
    error?: string | null;
}

export type VerifyEmailEvent = {
    type: 'VERIFY';
}