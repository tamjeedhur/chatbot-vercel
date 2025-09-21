import { assign, fromCallback, setup } from 'xstate';
import { API_VERSION,Server_URL } from '@/utils/constants';
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';

interface UploadContext {
  progress: number;
  url?: string;
  error?: string | null;
  file?: File;
  response?: any;
  accessToken?: string;
}

type UploadEvents =
  | { type: 'START'; file: File }
  | { type: 'PROGRESS'; progress: number }
  | { type: 'RESOLVE'; url: string }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' };

const uploadProgressMachine = setup({
  types: {
    context: {} as UploadContext,
    events: {} as UploadEvents,
    input: {} as { file?: File, accessToken?: string },
  },
  actors: {
    xhrUpload: fromCallback(({ input, sendBack }) => {
      const endpoint = `${Server_URL}/api/${API_VERSION}/files/upload`;
      const { file, accessToken } = input as { file?: File; accessToken?: string };
      if (!file) {
        const errorMessage = 'No file provided';
        toast.error(errorMessage);
        sendBack({ type: 'ERROR', message: errorMessage });
        return () => {};
      }
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.withCredentials = true;
      
      // Add Authorization header if accessToken is available
      if (accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      }

      xhr.upload.onprogress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded * 100) / e.total);
          console.log('progress from inside machine ', pct);
          sendBack({ type: 'PROGRESS', progress: pct });
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          try {
            const json = JSON.parse(xhr.responseText || '{}');
            if (xhr.status >= 200 && xhr.status < 300) {
              // Handle new API response structure
              let url: string | undefined;
              
              if (json?.files && json.files.length > 0) {
                // New structure: files[0].urls.download
                url = json.files[0]?.urls?.view;
              }
              
              if (url) {
                // Show success toast with API message
                const message = json?.message || 'File uploaded successfully';
                toast.success(message);
                sendBack({ type: 'RESOLVE', url });
              } else {
                const errorMessage = 'Upload succeeded but URL is missing from response';
                toast.error(errorMessage);
                sendBack({ type: 'ERROR', message: errorMessage });
              }
            } else {
              let message = json?.message || `Upload failed (${xhr.status})`;
              
              // Handle specific error cases
              if (xhr.status === 401) {
                message = 'Authentication failed. Please log in again.';
              } else if (xhr.status === 403) {
                message = 'Access denied. You do not have permission to upload files.';
              } else if (xhr.status === 413) {
                message = 'File too large. Please choose a smaller file.';
              }
              
              toast.error(message);
              sendBack({ type: 'ERROR', message });
            }
          } catch (err: any) {
            const errorMessage = extractErrorMessage(err) || 'Upload failed';
            toast.error(errorMessage);
            sendBack({ type: 'ERROR', message: errorMessage });
          }
        }
      };

      xhr.onerror = () => {
        const errorMessage = 'Network error during upload';
        toast.error(errorMessage);
        sendBack({ type: 'ERROR', message: errorMessage });
      };

      xhr.send(formData);
      return () => {
        try { xhr.abort(); } catch {}
      };
    }),
  },
  actions: {
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'File uploaded successfully';
      toast.success(message);
    },
    showErrorToast: ({ event }: any) => {
      const message = event.error?.message || 'An error occurred';
      toast.error(message);
    },
    setErrorWithToast: assign({
      error: ({ event }: any) => {
        const errorMessage = event.error?.message || 'An error occurred';
        // Show toast notification for error
        toast.error(errorMessage);
        return errorMessage;
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFcAOAbA9gQwgBQCdMoC5YBZbAYwAsBLAOzADo6J0wBiAZQBUBBAEq8A2gAYAuolCpMsOgBc6mBtJAAPRAGYAbAE5mADh0B2AEwBGHYcN6ArHZ1idAGhABPRGbN3m3nY4WevZ6AXomAL4RbmhYuITEpLAU1PRMrOxcggCi3Nmikmqy8koqapoIZjpafiZaACyN+g3WFnZunggWVsxBYhZiwfXdWkH1UTEYOPhEJGSUtIwssdOMUJx4ggDyAOI53NziUkggxYrKqicVdt3M-fb1YiY2JkGGHV5ahsyvOqb6j3CJjshgmIBW8VmSRSi3SEIga04+y2ABkAGrZI5FOTnMpXRCmExGUxjL5ifr9D4IBpiXp6LTeEzOcKhLRg+EJObJBZpZZTXCI7KCbaCLEnM6lS6gCq6AzGcxWGz2RzOKlaLS0nT1BlmJWjBnVdn8maJeapJbMWDIKhUMhI3L5MUyHGS8oE0JGbV1OxiXSPOxmKmGCzMH3ksRmYFieoBQ3RcHGznQnkWgBm2Do6GQpB4AmETtOLoubq6jmYjTs6vqQ26A3eHkQ9RM9WYsuewa+1TZ8Y5ULNsJY6cz2ayDoKx2dJWL+NLOnL9UrDRr3TE9c6FmMzD0Vj+oSb1X8UXjDEwEDgal7pu55qY2KneOliAAtK4GwgX3dw1-vxZxj3E3214DhkHB3riUoaF4zZGGYvrqrBFgmPoSFUpYRJajqhjapYBqRP+cQmlyMK8sw8JrGBrozvUhhmEYNE0ZY9KDBY6pqo8vTIQ8ozhIYDRGgRSb9iRVo2mQFHTo+CCGKu5ZaFG5gMtWoxqiCdzGNRAbkk4Nj8dMglASRQ5ZqQ4kPpBCD1IGb7UXO4Qsbx1QUvY3ZREAA */
  id: 'uploadProgressMachine',
  context: ({ input }) => ({ progress: 0, error: null, url: undefined, accessToken: input.accessToken }),
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: {
          target: 'uploading',
          actions: assign({ file: ({ event }) => (event.type === 'START' ? event.file : undefined), progress: () => 0, error: () => null, url: () => undefined }),
        },
        RESET: { actions: assign({ progress: () => 0, error: () => null, url: () => undefined, file: () => undefined }) },
      },
    },
    uploading: {
      invoke: {
        src: 'xhrUpload',
        input: ({ context }) => ({ file: context.file, accessToken: context.accessToken }),
      },
      on: {
        PROGRESS: { actions: assign({ progress: ({ event }) => event.progress }) },
        RESOLVE: { 
          target: 'success', 
          actions: assign({ 
            url: ({ event }) => event.url, 
            progress: () => 100 
          }) 
        },
        ERROR: { 
          target: 'failure', 
          actions: assign({ 
            error: ({ event }) => event.message 
          }) 
        },
      },
    },
    success: {
      on: { RESET: { target: 'idle', actions: assign({ progress: () => 0, error: () => null, url: () => undefined }) } },
    },
    failure: {
      on: {
        START: { target: 'uploading', actions: assign({ progress: () => 0, error: () => null, url: () => undefined }) },
        RESET: { target: 'idle', actions: assign({ progress: () => 0, error: () => null, url: () => undefined }) },
      },
    },
  },
});

export default uploadProgressMachine;