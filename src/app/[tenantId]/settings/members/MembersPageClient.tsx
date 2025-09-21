'use client';

import React, { useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { membersMachine, Member, InviteMemberData } from '@/machines/membersMachine';
import MemberCard from '@/components/ui/member-card';
import InviteMemberDialog from '@/components/ui/invite-member-dialog';

interface MembersPageClientProps {
  initialMembers: Member[];
  serverUrl: string;
}

export default function MembersPageClient({ initialMembers, serverUrl }: MembersPageClientProps) {
  const { data: session } = useSession();

  // Get bearer token from session
  const bearerToken = useMemo(() => {
    return (session as any)?.accessToken || '';
  }, [session]);

  const [state, send] = useMachine(membersMachine, {
    input: {
      initialMembers,
      serverUrl,
      bearerToken,
    },
  });

  const handleInviteMember = (data: InviteMemberData) => {
    send({ type: 'INVITE_MEMBER', data });
  };

  const handleDeleteMember = (invitationId: string) => {
    send({ type: 'DELETE_MEMBER', invitationId });
  };

  const handleRefresh = () => {
    send({ type: 'REFRESH' });
  };

  const handleClearError = () => {
    send({ type: 'CLEAR_ERROR' });
  };

  const isLoading = state.context.loading;
  const error = state.context.error;
  const members = state.context.members;

  return (
    <AdminLayout>
      <div className='space-y-6 p-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Members</h1>
            <p className='text-muted-foreground mt-2'>Manage workspace members and permissions</p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={handleRefresh} disabled={isLoading} className='min-w-[100px]'>
              {isLoading ? (
                <>
                  <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Refresh
                </>
              )}
            </Button>
            <InviteMemberDialog onInvite={handleInviteMember} loading={isLoading} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex items-center justify-between'>
              <span>{error}</span>
              <Button variant='outline' size='sm' onClick={handleClearError} className='ml-2'>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Members Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>Team Members</CardTitle>
            <CardDescription>People with access to this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && members.length === 0 ? (
              // Loading skeleton for initial load
              <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className='flex items-center justify-between py-3'>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-10 w-10 rounded-full' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-3 w-48' />
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-6 w-16' />
                      <Skeleton className='h-6 w-20' />
                      <Skeleton className='h-8 w-8' />
                    </div>
                  </div>
                ))}
              </div>
            ) : members.length > 0 ? (
              // Members list
              <div className='space-y-4'>
                {members.map((member) => (
                  <MemberCard
                    key={member.id || member.invitationId}
                    member={member}
                    onDelete={handleDeleteMember}
                    showDeleteButton={member.role !== 'Owner'}
                  />
                ))}
              </div>
            ) : (
              // Empty state
              <div className='flex items-center justify-center py-8 text-muted-foreground'>
                <div className='text-center'>
                  <p className='text-lg font-medium'>No members found</p>
                  <p className='text-sm mt-1'>Start by inviting team members to your workspace</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
