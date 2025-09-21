'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
interface TopKeywordsData {
  keyword: string;
  count: number;
  color: string;
}

interface SentimentData {
  sentiment: string;
  count: number;
  color: string;
}

interface DailySentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface ConversationInsightsProps {
  topKeywordsData: TopKeywordsData[];
  sentimentData: SentimentData[];
  dailySentimentData: DailySentimentData[];
}

const chartConfig = {
  keywords: {
    label: "Keywords",
  },
  sentiment: {
    label: "Sentiment",
  },
  positive: {
    label: "Positive",
    color: "hsl(120, 70%, 50%)",
  },
  neutral: {
    label: "Neutral", 
    color: "hsl(45, 70%, 60%)",
  },
  negative: {
    label: "Negative",
    color: "hsl(0, 70%, 50%)",
  },
};

export default function ConversationInsights({ 
  topKeywordsData, 
  sentimentData, 
  dailySentimentData 
}: ConversationInsightsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Top Keywords</CardTitle>
          <CardDescription>Most frequently mentioned topics in conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={topKeywordsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-keywords)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sentiment Distribution</CardTitle>
          <CardDescription>Overall customer sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="count"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="flex justify-center mt-4 space-x-4">
            {sentimentData.map((item) => (
              <div key={item.sentiment} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.sentiment} ({item.count}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Sentiment Score */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Daily Sentiment Score</CardTitle>
          <CardDescription>Customer sentiment trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={dailySentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="var(--color-positive)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-positive)" }}
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="var(--color-neutral)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-neutral)" }}
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="var(--color-negative)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-negative)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}