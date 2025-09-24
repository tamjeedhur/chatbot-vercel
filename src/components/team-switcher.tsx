"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Bot } from "lucide-react"
import { useChatBotMachineState } from "@/providers/ChatBotMachineProvider"
import { useRouter, usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function TeamSwitcher() {
  const [state, send] = useChatBotMachineState();
  const chatbots = state.context.chatbots;
  const selectedChatbot = state.context.selectedChatbot;
  const { isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  // Create a logo component with fallback logic (same as in app-sidebar)
  const SelectedChatbotLogo = ({ className }: { className?: string }) => {
    const [imageError, setImageError] = React.useState(false);
    const logoUrl = selectedChatbot?.ui?.logoUrl;
    
    // Use regular img tag to avoid Next.js Image configuration issues
    if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) && !imageError) {
      return (
        <img
          src={logoUrl}
          alt="Chatbot Logo"
          className={className}
          onError={() => setImageError(true)}
        />
      );
    }
    // Fallback to Bot icon for invalid URLs or failed images
    return <Bot className={className} />;
  };

  // Create a reusable logo component for dropdown items
  const ChatbotLogo = ({ chatbot, className }: { chatbot: any; className?: string }) => {
    const [imageError, setImageError] = React.useState(false);
    const logoUrl = chatbot?.ui?.logoUrl;
    
    // Use regular img tag to avoid Next.js Image configuration issues
    if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) && !imageError) {
      return (
        <img
          src={logoUrl}
          alt="Chatbot Logo"
          className={className}
          onError={() => setImageError(true)}
        />
      );
    }
    // Fallback to Bot icon for invalid URLs or failed images
    return <Bot className={className} />;
  };

const handleActiveTeam = (team: any) => {
  // Update the XState machine state
  send({ type: 'SYNC_SELECTED_CHATBOT', data: team });
  
  // Navigate to the new URL with the selected chatbot ID
  if (pathname && team._id && state.context.tenantId) {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    // Check if we're in a chatbot-specific route (has tenantId and selectedChatbotId)
    // Expected structure: ['tenantId', 'selectedChatbotId', 'page', ...]
    if (pathSegments.length >= 2 && pathSegments[0] === state.context.tenantId) {
      // Replace the chatbot ID (second segment) with the new one
      pathSegments[1] = team._id;
      const newPath = '/' + pathSegments.join('/');
      router.push(newPath);
    } else {
      // If not in a chatbot-specific route, navigate to dashboard with new chatbot
      router.push(`/${state.context.tenantId}/${team._id}/dashboard`);
    }
  }
}
  return (
    <SidebarMenu>
      <SidebarMenuItem className="hover:bg-sidebar-accent">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:bg-sidebar-accent">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground bg-white">
                  <SelectedChatbotLogo className="size-8 rounded-lg text-black" />
                </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedChatbot?.name || 'Select Chatbot'}
                </span>
                <span className="truncate text-xs">{selectedChatbot?.plan || 'Free'}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Chatbots
            </DropdownMenuLabel>
            {chatbots.map((chatbot:any) => (
              <DropdownMenuItem
                key={chatbot._id}
                onClick={() => handleActiveTeam(chatbot)}
                className="gap-2 p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ChatbotLogo chatbot={chatbot} className="size-6 shrink-0 rounded-sm" />
                </div>
                {chatbot.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <Link href={`/${state.context.tenantId}/create-chatbot`} className="w-full flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4 " />
              </div>
              <div className="font-medium text-muted-foreground">Add Chatbot</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
