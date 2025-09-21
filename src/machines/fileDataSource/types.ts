export interface UploadPayload {
  file: File;
  columnMappings: string;
  delimiter: string;
  hasHeader: boolean;
  skipEmptyRows: boolean;
}

export interface FileDataSourceContext {
  error: string | null;
  isLoading: boolean;
  uploadResponse: any;
}

export type FileDataSourceEvents = { type: 'UPLOAD_FILE'; payload: UploadPayload & { chatbotId: string } };

export interface FileDataSourceInput {
  // No initial input required for this machine
}
