'use client';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import AdminLayout from '@/components/adminlayout/AdminLayout';
const queryClient = new QueryClient();

const CreateChatBot = () => (
  <AdminLayout>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Index />
    </TooltipProvider>
  </QueryClientProvider>
  </AdminLayout>
);

export default CreateChatBot;
