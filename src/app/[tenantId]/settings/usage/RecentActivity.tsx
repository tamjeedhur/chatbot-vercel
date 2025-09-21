'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
interface RecentActivityItem {
  time: string;
  action: string;
  user: string;
  rating: string;
}

interface RecentActivityProps {
  recentActivity: RecentActivityItem[];
}

export default function RecentActivity({ recentActivity }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Recent Activity</CardTitle>
        <CardDescription>Latest chatbot interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.user} • {activity.time}</p>
              </div>
              <span className="text-lg">{activity.rating}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
