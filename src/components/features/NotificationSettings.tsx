'use client';

import React, { useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationToggle } from '@/components/ui/notification-toggle';
import { Button } from '@/components/ui/button';
import { notificationSettingsMachine } from '@/machines/notificationSettingsMachine';
import { updateNotificationSettings } from '@/app/actions/notification-actions';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  initialSettings: {
    email: {
      newTeamMember: boolean;
      billingUpdates: boolean;
      securityAlerts: boolean;
      weeklyUsageReports: boolean;
    };
    inApp: {
      realTimeUpdates: boolean;
      soundNotifications: boolean;
    };
  };
  tenantId: string;
  serverUrl: string;
  bearerToken: string;
}

export function NotificationSettings({ initialSettings, tenantId, serverUrl, bearerToken }: NotificationSettingsProps) {
  // Create machine with server actions
  const machine = useMemo(() => {
    return notificationSettingsMachine.provide({
      actors: {
        saveNotificationSettings: fromPromise(async ({ input }: { input: any }) => {
          const result = await updateNotificationSettings(input.settings);
          if (!result.success) {
            throw new Error(result.error || 'Failed to update settings');
          }
          return result;
        }),
      },
    });
  }, []);

  const [state, send] = useMachine(machine, {
    input: {
      initialSettings,
      tenantId,
      serverUrl,
      bearerToken,
    },
  });

  const handleNotificationUpdate = (path: string, value: boolean) => {
    send({
      type: 'UPDATE_NOTIFICATION',
      path,
      value,
    });
  };

  const handleSave = () => {
    send({ type: 'SAVE_SETTINGS' });
  };

  const handleRetry = () => {
    send({ type: 'RESET_ERROR' });
  };

  // Show success toast when settings are saved
  React.useEffect(() => {
    if (state.context.status === 'success') {
      toast.success('Notification settings updated successfully');
    }
  }, [state.context.status]);

  // Show error toast when there's an error
  React.useEffect(() => {
    if (state.context.status === 'error' && state.context.error) {
      toast.error(state.context.error);
    }
  }, [state.context.status, state.context.error]);

  const isLoading = state.context.status === 'loading';
  const hasError = state.context.status === 'error';

  return (
    <div className='space-y-6'>
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Email Notifications</CardTitle>
          <CardDescription>Choose which events trigger email notifications</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <NotificationToggle
            id='new-team-member'
            title='New Team Member'
            description='When someone joins the workspace'
            checked={state.context.settings.email.newTeamMember}
            onCheckedChange={(checked) => handleNotificationUpdate('email.newTeamMember', checked)}
            disabled={isLoading}
          />
          <NotificationToggle
            id='billing-updates'
            title='Billing Updates'
            description='Payment confirmations and failures'
            checked={state.context.settings.email.billingUpdates}
            onCheckedChange={(checked) => handleNotificationUpdate('email.billingUpdates', checked)}
            disabled={isLoading}
          />
          <NotificationToggle
            id='security-alerts'
            title='Security Alerts'
            description='Suspicious activity and login attempts'
            checked={state.context.settings.email.securityAlerts}
            onCheckedChange={(checked) => handleNotificationUpdate('email.securityAlerts', checked)}
            disabled={isLoading}
          />
          <NotificationToggle
            id='weekly-usage-reports'
            title='Weekly Usage Reports'
            description='Summary of workspace activity'
            checked={state.context.settings.email.weeklyUsageReports}
            onCheckedChange={(checked) => handleNotificationUpdate('email.weeklyUsageReports', checked)}
            disabled={isLoading}
            showSeparator={false}
          />
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>In-App Notifications</CardTitle>
          <CardDescription>Manage notifications within the application</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <NotificationToggle
            id='real-time-updates'
            title='Real-time Updates'
            description='Live notifications for workspace activity'
            checked={state.context.settings.inApp.realTimeUpdates}
            onCheckedChange={(checked) => handleNotificationUpdate('inApp.realTimeUpdates', checked)}
            disabled={isLoading}
          />
          <NotificationToggle
            id='sound-notifications'
            title='Sound Notifications'
            description='Audio alerts for important events'
            checked={state.context.settings.inApp.soundNotifications}
            onCheckedChange={(checked) => handleNotificationUpdate('inApp.soundNotifications', checked)}
            disabled={isLoading}
            showSeparator={false}
          />
        </CardContent>
      </Card>

      {/* Error State */}
      {hasError && (
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-destructive font-medium'>Failed to update settings</p>
                <p className='text-sm text-muted-foreground'>{state.context.error}</p>
              </div>
              <Button variant='outline' onClick={handleRetry}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button onClick={handleSave} disabled={isLoading} className='min-w-[120px]'>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
