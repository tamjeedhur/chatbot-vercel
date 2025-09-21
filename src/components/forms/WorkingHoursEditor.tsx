'use client';

import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import { numericDayNames } from '@/utils/constants';
import { WorkingHoursEditorProps, WorkingDay } from '@/types/chatbotConfiguration';

export const WorkingHoursEditor: React.FC<WorkingHoursEditorProps> = ({ schedule, onScheduleChange, disabled = false, className = '' }) => {
  // Note: Schedule initialization is now handled at the machine level
  // This component only handles editing of existing schedules

  // Helper function to check if a day is enabled (has valid start/end times)
  const isDayEnabled = (day: WorkingDay): boolean => {
    return Boolean(day.start && day.end && day.start !== '' && day.end !== '');
  };

  // Helper function to get display name for numeric day
  const getDayDisplayName = (dayNumber: number) => {
    return numericDayNames[dayNumber] || `Day ${dayNumber}`;
  };

  const handleDayToggle = (index: number, enabled: boolean) => {
    // Create a deep copy of the current schedule
    const newSchedule = displaySchedule.map(day => ({ ...day }));
    
    if (enabled) {
      // Enable the day by setting default times if empty
      newSchedule[index].start = '09:00';
      newSchedule[index].end = '17:00';
    } else {
      // Disable the day by clearing times
      newSchedule[index].start = '';
      newSchedule[index].end = '';
    }
    
    onScheduleChange(newSchedule);
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    // Create a deep copy of the current schedule
    const newSchedule = displaySchedule.map(day => ({ ...day }));
    newSchedule[index][field] = value;
    onScheduleChange(newSchedule);
  };

  // Ensure we always have a schedule to display - memoized to prevent infinite loops
  const displaySchedule = useMemo(() => {
    return schedule && schedule.length > 0 ? schedule : [
      { day: 0, start: '09:00', end: '17:00' },
      { day: 1, start: '09:00', end: '17:00' },
      { day: 2, start: '09:00', end: '17:00' },
      { day: 3, start: '09:00', end: '17:00' },
      { day: 4, start: '09:00', end: '17:00' },
      { day: 5, start: '09:00', end: '17:00' },
      { day: 6, start: '09:00', end: '17:00' },
    ];
  }, [schedule]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className='text-lg font-semibold text-foreground'>Weekly Schedule</h3>
      


      <div className='space-y-4'>
        {displaySchedule.map((day, index) => {
          const enabled = isDayEnabled(day);
          return (
            <div
              key={`day-${day.day}-${index}`}
              className="flex items-center gap-4 p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => handleDayToggle(index, e.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary rounded border-input"
                />
                <div className="w-20 text-sm font-medium text-foreground">
                  {getDayDisplayName(day.day)}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <input
                  type="time"
                  value={day.start || ''}
                  onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                  disabled={disabled || !enabled}
                  className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground bg-background text-foreground"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <input
                  type="time"
                  value={day.end || ''}
                  onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                  disabled={disabled || !enabled}
                  className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground bg-background text-foreground"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                {enabled ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                ) : (
                  <span className="text-muted-foreground">Closed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg'>
        <div className='flex items-start gap-3'>
          <Info size={16} className='text-primary mt-0.5' />
          <div>
            <h4 className='text-sm font-medium text-primary'>Outside Business Hours</h4>
            <p className='text-sm text-primary/80 mt-1'>
              When working hours are enabled, visitors will see a message indicating the chatbot is currently unavailable and when it will be back online.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
