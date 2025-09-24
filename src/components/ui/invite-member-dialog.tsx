import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import InviteMemberForm from '@/components/forms/invite-member-form';
import { InviteMemberData } from '@/machines/membersMachine';

interface InviteMemberDialogProps {
  onInvite: (data: InviteMemberData) => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({ onInvite, loading = false, disabled = false, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInvite = (data: InviteMemberData) => {
    onInvite(data);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!loading && !disabled) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button disabled={disabled} className={className}>
            <Plus className='w-4 h-4 mr-2' />
            Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='w-5 h-5' />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>Send an invitation to join this workspace</DialogDescription>
        </DialogHeader>
        <InviteMemberForm onSubmit={handleInvite} loading={loading} disabled={disabled} />
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
