'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
interface UsageChartData {
  date: string;
  conversations: number;
  messages: number;
}

interface ResponseTimeData {
  time: string;
  avgResponse: number;
}

interface ResolutionData {
  category: string;
  count: number;
  color: string;
}

interface HourlyActivityData {
  hour: string;
  conversations: number;
}

interface UsageChartProps {
  usageChartData: UsageChartData[];
  responseTimeData: ResponseTimeData[];
  resolutionData: ResolutionData[];
  hourlyActivityData: HourlyActivityData[];
}

const chartConfig = {
  conversations: {
    label: "Conversations",
    color: "hsl(var(--primary))",
  },
  messages: {
    label: "Messages", 
    color: "hsl(var(--primary) / 0.8)",
  },
  avgResponse: {
    label: "Avg Response Time",
    color: "hsl(var(--primary))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(120, 70%, 50%)",
  },
  escalated: {
    label: "Escalated",
    color: "hsl(45, 70%, 60%)",
  },
  unresolved: {
    label: "Unresolved", 
    color: "hsl(0, 70%, 50%)",
  },
};

export default function UsageChart({ 
  usageChartData, 
  responseTimeData, 
  resolutionData, 
  hourlyActivityData 
}: UsageChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Daily Conversations</CardTitle>
          <CardDescription>Customer support chatbot usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={usageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="conversations" 
                stroke="var(--color-conversations)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-conversations)" }}
              />
              <Line 
                type="monotone" 
                dataKey="messages" 
                stroke="var(--color-messages)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-messages)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Response Times</CardTitle>
          <CardDescription>Average response time by hour (seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="avgResponse" 
                fill="var(--color-avgResponse)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Resolution Rate</CardTitle>
          <CardDescription>How conversations are being resolved</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={resolutionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="count"
              >
                {resolutionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="flex justify-center mt-4 space-x-4">
            {resolutionData.map((item) => (
              <div key={item.category} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.category} ({item.count}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hourly Activity</CardTitle>
          <CardDescription>Conversation volume throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={hourlyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="conversations" 
                fill="var(--color-conversations)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}