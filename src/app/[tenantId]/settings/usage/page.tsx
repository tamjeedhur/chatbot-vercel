'use server'
import React from 'react'
import dynamic from 'next/dynamic'
import AdminLayout from '@/components/adminlayout/AdminLayout'

// Dynamically import client components to prevent SSR issues
const UsageChart = dynamic(() => import('./UsageChart'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
})

const ConversationInsights = dynamic(() => import('./ConversationInsights'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`bg-white rounded-lg border p-6 ${i === 2 ? "lg:col-span-2" : ""}`}>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
})

const MetricsCards = dynamic(() => import('./MetricsCards'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
})

const RecentActivity = dynamic(() => import('./RecentActivity'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

interface UsagePageProps {
  params: {
    tenantId: string;
  };
}

const page = async ({ params }: UsagePageProps) => {
  // Mock data defined directly in the server component
  const metrics = {
    totalConversations: 1234,
    avgResponseTime: 2.3,
    customerSatisfaction: 94,
    resolutionRate: 87,
  };

  const usageChartData = [
    { date: "Jan 1", conversations: 45, messages: 230 },
    { date: "Jan 2", conversations: 52, messages: 280 },
    { date: "Jan 3", conversations: 38, messages: 195 },
    { date: "Jan 4", conversations: 61, messages: 320 },
    { date: "Jan 5", conversations: 47, messages: 245 },
    { date: "Jan 6", conversations: 55, messages: 290 },
    { date: "Jan 7", conversations: 42, messages: 220 },
  ];

  const responseTimeData = [
    { time: "9 AM", avgResponse: 2.5 },
    { time: "11 AM", avgResponse: 1.8 },
    { time: "1 PM", avgResponse: 3.2 },
    { time: "3 PM", avgResponse: 2.1 },
    { time: "5 PM", avgResponse: 4.5 },
    { time: "7 PM", avgResponse: 1.9 },
  ];

  const resolutionData = [
    { category: "Resolved", count: 87, color: "hsl(120, 70%, 50%)" },
    { category: "Escalated", count: 8, color: "hsl(45, 70%, 60%)" },
    { category: "Unresolved", count: 5, color: "hsl(0, 70%, 50%)" },
  ];

  const hourlyActivityData = [
    { hour: "12 AM", conversations: 12 },
    { hour: "2 AM", conversations: 8 },
    { hour: "4 AM", conversations: 5 },
    { hour: "6 AM", conversations: 15 },
    { hour: "8 AM", conversations: 45 },
    { hour: "10 AM", conversations: 78 },
    { hour: "12 PM", conversations: 89 },
    { hour: "2 PM", conversations: 95 },
    { hour: "4 PM", conversations: 67 },
    { hour: "6 PM", conversations: 34 },
    { hour: "8 PM", conversations: 23 },
    { hour: "10 PM", conversations: 18 },
  ];

  const topKeywordsData = [
    { keyword: "login", count: 89, color: "hsl(var(--primary))" },
    { keyword: "issue", count: 76, color: "hsl(var(--primary) / 0.8)" },
    { keyword: "help center", count: 45, color: "hsl(var(--primary) / 0.6)" },
  ];

  const sentimentData = [
    { sentiment: "Positive", count: 68, color: "hsl(120, 70%, 50%)" },
    { sentiment: "Neutral", count: 25, color: "hsl(45, 70%, 60%)" },
    { sentiment: "Negative", count: 7, color: "hsl(0, 70%, 50%)" },
  ];

  const dailySentimentData = [
    { date: "Mar 23rd", positive: 72, neutral: 23, negative: 5 },
    { date: "Mar 26th", positive: 75, neutral: 20, negative: 5 },
    { date: "Mar 29th", positive: 68, neutral: 27, negative: 5 },
    { date: "Apr 1st", positive: 70, neutral: 25, negative: 5 },
    { date: "Apr 4th", positive: 69, neutral: 26, negative: 5 },
    { date: "Apr 7th", positive: 71, neutral: 24, negative: 5 },
    { date: "Apr 10th", positive: 68, neutral: 25, negative: 7 },
    { date: "Apr 13th", positive: 65, neutral: 28, negative: 7 },
    { date: "Apr 16th", positive: 67, neutral: 26, negative: 7 },
    { date: "Apr 19th", positive: 64, neutral: 29, negative: 7 },
  ];

  const recentActivity = [
    { time: "2 minutes ago", action: "Conversation resolved", user: "Anonymous User", rating: "👍" },
    { time: "5 minutes ago", action: "New conversation started", user: "john@example.com", rating: "⭐" },
    { time: "12 minutes ago", action: "Escalated to human agent", user: "sarah@company.com", rating: "❓" },
    { time: "18 minutes ago", action: "FAQ answered successfully", user: "Anonymous User", rating: "👍" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Usage & Analytics</h1>
          <p className="text-muted-foreground mt-2">Monitor your chatbot performance and usage</p>
        </div>

        {/* Key Metrics */}
        <MetricsCards metrics={metrics} />

        {/* Charts */}
        <UsageChart 
          usageChartData={usageChartData}
          responseTimeData={responseTimeData}
          resolutionData={resolutionData}
          hourlyActivityData={hourlyActivityData}
        />
        
        {/* Conversation Insights */}
        <ConversationInsights 
          topKeywordsData={topKeywordsData}
          sentimentData={sentimentData}
          dailySentimentData={dailySentimentData}
        />

        {/* Recent Activity */}
        <RecentActivity recentActivity={recentActivity} />
      </div>
    </AdminLayout>
  )
}

export default page