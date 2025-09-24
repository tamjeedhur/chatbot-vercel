'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Chatbot Creation Error
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            We encountered an error while loading the chatbot creation form. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                Error details (Development Mode)
              </summary>
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto max-h-60">
                <div className="mb-2">
                  <strong>Error Message:</strong>
                </div>
                <pre className="whitespace-pre-wrap break-words">
                  {error.message}
                </pre>
                {error.stack && (
                  <>
                    <div className="mt-3 mb-2">
                      <strong>Stack Trace:</strong>
                    </div>
                    <pre className="whitespace-pre-wrap break-words text-xs">
                      {error.stack}
                    </pre>
                  </>
                )}
                {error.digest && (
                  <div className="mt-3">
                    <strong>Digest:</strong> {error.digest}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
