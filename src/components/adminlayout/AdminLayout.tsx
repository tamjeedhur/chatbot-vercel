'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggleWrapper from '../Auth/ThemeToggleWrapper';
import { SearchBar } from '../searchBar/SearchBar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const generateBreadcrumbs = (pathname: string | null) => {
  if (!pathname) return undefined;
  // Remove leading and trailing slashes
  const paths = pathname?.split('/').filter(Boolean) || [];

  return paths.map((path, index) => {
    // Create the URL for this breadcrumb level
    const href = '/' + paths.slice(0, index + 1).join('/');
    // Format the path name for display
    const displayName = path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { href, displayName };
  });
};

import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { Toaster } from '@/components/ui/sonner';

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

export default function AdminLayout(props: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const { children, ...rest } = props;
  const [state, send] = useChatBotMachineState();

  useEffect(() => {
    window.document.documentElement.dir = 'ltr';
  }, []);

  // Handle chatbot selection change
  const handleChatbotChange = (chatbot: any) => {
    send({ type: 'SET_SELECTED_CHATBOT', chatbotId: chatbot._id });

    // Navigate to the same page but with the new chatbot ID
    const currentPath = pathname;
    if (currentPath) {
      const pathSegments = currentPath.split('/');

      // Find the chatbot ID in the path (it's typically the first segment after the root)
      if (pathSegments.length >= 2) {
        // Replace the chatbot ID with the new one
        pathSegments[1] = chatbot._id;
        const newPath = pathSegments.join('/');
        router.push(newPath);
      }
    }
  };
  const dummyChatbots = [
    {
      name: "Sales ChatBot",
      _id: "1234567890",
    },
  ]
  const selectedChatbot = dummyChatbots[0];
  return (
    <SidebarProvider>
      <AppSidebar className='border-0 ring-0 focus:ring-0' />
      <SidebarInset>
        <div className='min-h-screen flex flex-col bg-background text-foreground'>
          {/* Sidebar toggle and separator */}
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear border-b border-border'>
            <div className='flex items-center gap-2 px-4 w-full py-5'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='mr-2 h-5' />

              <Breadcrumb>
                <BreadcrumbList>
                  {selectedChatbot?.name && (
                    <>
                      <BreadcrumbItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <BreadcrumbPage className='flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm px-1'>
                              {selectedChatbot.name}
                              <Badge variant='secondary' className='text-xs px-1.5 py-0.5'>
                                Free
                              </Badge>

                              <svg
                                width='12'
                                height='12'
                                viewBox='0 0 12 12'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                className='text-muted-foreground'>
                                <path d='M3 4.5L6 1.5L9 4.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                                <path d='M3 7.5L6 10.5L9 7.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                              </svg>
                            </BreadcrumbPage>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='start'>
                            {dummyChatbots?.map((chatbot: any) => (
                              <DropdownMenuItem
                                key={chatbot._id}
                                // onClick={() => handleChatbotChange(chatbot)}
                                className={selectedChatbot?._id === chatbot._id ? 'bg-accent' : ''}>
                                {chatbot.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className='hidden md:block' />
                    </>
                  )}
                  {breadcrumbs?.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{crumb.displayName}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>{crumb.displayName}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className='hidden md:block' />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              <div className='ml-auto flex gap-4 py-2'>
                <SearchBar />
                <ThemeToggleWrapper />
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className='flex-1 overflow-auto'>
            <div className='mx-auto'>{children}</div>
          </main>
        </div>
      </SidebarInset>
      <Toaster richColors position='bottom-right' />
    </SidebarProvider>
  );
}
