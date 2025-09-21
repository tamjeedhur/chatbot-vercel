import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Mail } from 'lucide-react';
import { InviteMemberData } from '@/machines/membersMachine';

interface InviteMemberFormProps {
  onSubmit: (data: InviteMemberData) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' },
  { value: 'guest', label: 'Guest' },
] as const;

export const InviteMemberForm: React.FC<InviteMemberFormProps> = ({ onSubmit, loading = false, disabled = false, className = '' }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !role) return;

    onSubmit({
      email: email.trim(),
      role,
      message: message.trim() || undefined,
    });

    // Reset form
    setEmail('');
    setMessage('');
    setRole('user');
  };

  const isFormValid = email.trim().length > 0 && role.length > 0;
  const isDisabled = disabled || loading || !isFormValid;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email Address</Label>
        <Input
          id='email'
          type='email'
          placeholder='teammate@company.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled || loading}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Role</Label>
        <Select value={role} onValueChange={setRole} disabled={disabled || loading}>
          <SelectTrigger>
            <SelectValue placeholder='Select a role' />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='message'>Personal Message (Optional)</Label>
        <Textarea
          id='message'
          placeholder='Join our team workspace...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          disabled={disabled || loading}
        />
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='submit' disabled={isDisabled} className='min-w-[120px]'>
          {loading ? (
            <>
              <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent' />
              Sending...
            </>
          ) : (
            <>
              <Mail className='w-4 h-4 mr-2' />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default InviteMemberForm;


