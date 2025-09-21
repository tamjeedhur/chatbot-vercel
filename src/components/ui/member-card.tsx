import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Trash2 } from 'lucide-react';
import { Member } from '@/machines/membersMachine';

interface MemberCardProps {
  member: Member;
  onDelete?: (invitationId: string) => void;
  showDeleteButton?: boolean;
  className?: string;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'Owner':
    case 'Admin':
      return 'default';
    case 'Manager':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'inactive':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const MemberCard: React.FC<MemberCardProps> = ({ member, onDelete, showDeleteButton = true, className = '' }) => {
  const handleDelete = () => {
    if (onDelete && member.role !== 'Owner') {
      onDelete(member.invitationId);
    }
  };

  const canDelete = member.role !== 'Owner' && showDeleteButton && onDelete;

  return (
    <div className={`flex items-center justify-between py-3 border-b last:border-b-0 ${className}`}>
      <div className='flex items-center gap-3'>
        <Avatar>
          <AvatarFallback>
            {member.name
              ? member.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
              : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className='font-medium'>{member.name || 'Unknown User'}</p>
          <p className='text-sm text-muted-foreground'>{member.email}</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
        <Badge variant={getRoleBadgeVariant(member.role)}>
          {member.role === 'Owner' && <Crown className='w-3 h-3 mr-1' />}
          {member.role}
        </Badge>
        {canDelete && (
          <Button variant='ghost' size='icon' onClick={handleDelete} className='text-destructive hover:text-destructive hover:bg-destructive/10'>
            <Trash2 className='w-4 h-4' />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MemberCard;


