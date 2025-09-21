'use client'

import { Card, CardContent } from "@/components/ui/card";
interface UsageMetrics {
  totalConversations: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  resolutionRate: number;
}

interface MetricsCardsProps {
  metrics: UsageMetrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
              <p className="text-2xl font-bold">{metrics.totalConversations.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% from last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{metrics.avgResponseTime}s</p>
              <p className="text-xs text-green-600">-0.5s from last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
              <p className="text-2xl font-bold">{metrics.customerSatisfaction}%</p>
              <p className="text-xs text-green-600">+2% from last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold">{metrics.resolutionRate}%</p>
              <p className="text-xs text-red-600">-1% from last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
