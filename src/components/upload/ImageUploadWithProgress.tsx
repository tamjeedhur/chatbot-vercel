"use client";

import React from 'react';
import { useMachine } from '@xstate/react';
import uploadProgressMachine from '@/machines/uploadProgressMachine';
import { Progress } from '@/components/ui/progress';

type Props = {
  onUploaded: (url: string) => void;
  className?: string;
  accept?: string;
  label?: string;
  accessToken?: string;
};

const ImageUploadWithProgress: React.FC<Props> = ({ accessToken, onUploaded, className, accept = 'image/*', label = 'Upload Image' }) => {
  const [state, send] = useMachine(uploadProgressMachine, { input: { accessToken } });
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const processedUrlRef = React.useRef<string | null>(null);

  const onPick = () => inputRef.current?.click();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB
    send({ type: 'START', file });
  };

  React.useEffect(() => {
    const url = state.context.url;
    if (state.matches('success') && url && processedUrlRef.current !== url) {
      processedUrlRef.current = url;
      onUploaded(url);
      // Reset the machine to avoid re-invoking onUploaded on parent re-renders
      send({ type: 'RESET' });
    }
  }, [state.value, state.context.url, onUploaded, send]);

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept={accept} onChange={onChange} className="hidden" />
      <button type="button" onClick={onPick} className="px-3 py-2 rounded-md border text-sm">
        {label}
      </button>
      {state.matches('uploading') && (
        <div className="mt-2">
          <Progress value={state.context.progress} />
          <div className="text-xs text-muted-foreground mt-1">{state.context.progress}%</div>
        </div>
      )}
      {state.matches('failure') && (
        <div className="text-xs text-red-500 mt-2">{state.context.error}</div>
      )}
    </div>
  );
};

export default ImageUploadWithProgress;