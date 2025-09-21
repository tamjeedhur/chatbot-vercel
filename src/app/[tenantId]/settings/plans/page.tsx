'use server'
import React from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/adminlayout/AdminLayout';

// Dynamically import client components to prevent SSR issues
const PlansGrid = dynamic(() => import('./PlansGrid'), {
  ssr: false,
  loading: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  )
})

interface PlansPageProps {
  params: {
    tenantId: string;
  };
}

const page = async ({ params }: PlansPageProps) => {
  // Mock data defined directly in the server component
  const plans = [
    {
      _id: 'free-plan',
      id: 'free',
      name: 'Free Plan',
      price: 0,
      isActive: true,
      features: {
        maxMembers: 1,
        featureLevel: 'Basic',
        storageInGB: 1,
        support: 'community'
      }
    },
    {
      _id: 'pro-plan',
      id: 'pro',
      name: 'Pro Plan',
      price: 29,
      isActive: false,
      features: {
        maxMembers: 10,
        featureLevel: 'Advanced',
        storageInGB: 100,
        support: 'email'
      }
    },
    {
      _id: 'enterprise-plan',
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 99,
      isActive: false,
      features: {
        maxMembers: -1,
        featureLevel: 'Premium',
        storageInGB: 1000,
        support: 'priority'
      }
    }
  ];

  // Mock selected chatbot and organization data
  const selectedChatbot = {
    _id: 'mock-chatbot-id',
    name: 'Mock Chatbot',
    preferences: {
      plans: plans
    }
  };

  const organization = {
    id: 'mock-org-id',
    name: 'Mock Organization',
    owner: {
      email: 'owner@example.com'
    }
  };

  return (
    <AdminLayout>
      <div className='space-y-6 p-6'>
        <div>
          <h1 className='text-3xl font-bold'>Plans</h1>
          <p className='text-muted-foreground mt-2'>Choose the right plan for your workspace</p>
        </div>

        <PlansGrid 
          plans={plans}
          selectedChatbot={selectedChatbot}
          organization={organization}
        />
      </div>
    </AdminLayout>
  );
};

export default page;
