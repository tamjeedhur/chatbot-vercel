import { assign, fromPromise, setup } from 'xstate';
import axiosInstance from '@/lib/axiosInstance';
import { API_VERSION } from '@/utils/constants';
import { extractErrorMessage } from '@/utils/utils';
import { toast } from 'sonner';
import { FileDataSourceContext, FileDataSourceEvents, UploadPayload } from './types';

export const fileDataSourceMachine = setup({
  types: {
    context: {} as FileDataSourceContext,
    events: {} as FileDataSourceEvents,
  },
  actors: {
    uploadFile: fromPromise(async ({ input }: { input: UploadPayload & { chatbotId: string } }) => {
      try {
        const { chatbotId, ...uploadData } = input;
        const formData = new FormData();
        formData.append('file', uploadData.file);
        formData.append('columnMappings', uploadData.columnMappings);
        formData.append('delimiter', uploadData.delimiter);
        formData.append('hasHeader', uploadData.hasHeader.toString());
        formData.append('skipEmptyRows', uploadData.skipEmptyRows.toString());

        const response = await axiosInstance.post(`/api/${API_VERSION}/datasources/chatbots/${chatbotId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    setError: assign({
      error: ({ event }: any) => event.error.message,
    }),
    setUploadResponse: assign({
      uploadResponse: ({ event }: any) => event.output,
    }),
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'File uploaded successfully';
      toast.success(message);
    },
    showErrorToast: ({ event }: any) => {
      const errorMessage = event.error?.message || 'File upload failed';
      toast.error(errorMessage);
    },
  },
}).createMachine({
  id: 'fileDataSource',
  initial: 'idle',
  context: {
    error: null,
    isLoading: false,
    uploadResponse: null,
  },
  states: {
    idle: {
      on: {
        UPLOAD_FILE: {
          target: 'uploading',
          actions: assign({
            isLoading: () => true,
          }),
        },
      },
    },
    uploading: {
      invoke: {
        src: 'uploadFile',
        input: ({ event }: any) => event.payload,
        onDone: {
          target: 'success',
          actions: ['setUploadResponse', 'showSuccessToast'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'showErrorToast'],
        },
      },
    },
    success: {
      after: {
        1000: {
          target: 'idle',
          actions: assign({
            isLoading: () => false,
            error: () => null,
          }),
        },
      },
    },
    error: {
      after: {
        3000: {
          target: 'idle',
          actions: assign({
            isLoading: () => false,
            error: () => null,
          }),
        },
      },
    },
  },
});
