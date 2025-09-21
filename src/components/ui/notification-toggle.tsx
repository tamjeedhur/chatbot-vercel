'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface NotificationToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  showSeparator?: boolean;
}

export const NotificationToggle = ({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  showSeparator = true,
}: NotificationToggleProps) => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <Label htmlFor={id}>{title}</Label>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      </div>
      {showSeparator && <Separator />}
    </>
  );
};


