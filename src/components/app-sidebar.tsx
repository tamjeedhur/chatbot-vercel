"use client";

import * as React from "react";
import {
  Bot,
  LoaderPinwheel,
  MessageSquareCode,
  MonitorCog,
  Terminal,
  BookText,
  CircleGauge,
  Receipt,
  Code,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { useChatBotMachineState } from "@/providers/ChatBotMachineProvider";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [state, send] = useChatBotMachineState();
  const pathname = usePathname();

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    if (!pathname) return false;
    return pathname.startsWith(path);
  };


  const data = {
    user: {
      name: "zohaib hassan",
      email: "zohaib.hassan@codeanalytics.us",
      avatar: "/favicon.png",
    },
    navMain: [
      {
        title: "Dashboard",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/dashboard`,
        icon: CircleGauge,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/dashboard`
        ),
      },
      {
        title: "Data Source",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`,
        icon: LoaderPinwheel,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`
        ),
        items: [
          {
            title: "Data Source",
            url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`,
            icon: LoaderPinwheel,
          },
          {
            title: "File",
            url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources/file`,
            icon: LoaderPinwheel,
          },
          {
            title: "URL/Sitemap",
            url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources/urlSitemap`,
            icon: LoaderPinwheel,
          },
          {
            title: "Text",
            url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources/text`,
            icon: LoaderPinwheel,
          },
          {
            title: "Q/A",
            url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources/qa`,
            icon: LoaderPinwheel,
          },
        ],
      },
      {
        title: "Profile",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/profile`,
        icon: Bot,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/profile`
        ),
      },
      {
        title: "Settings",
        url: `/${state.context.tenantId}/settings`,
        icon: Settings,
        isActive: isPathActive(
          `/${state.context.tenantId}/settings`
        ),
        items: [
          {
            title: "General",
            url: `/${state.context.tenantId}/settings/general`,
          },
          {
            title: "Members",
            url: `/${state.context.tenantId}/settings/members`,
          },
          {
            title: "Usage & Analytics",
            url: `/${state.context.tenantId}/settings/usage`,
          },
          {
            title: "Security",
            url: `/${state.context.tenantId}/settings/security`,
          },
          {
            title: "Integrations",
            url: `/${state.context.tenantId}/settings/integrations`,
          },
          {
            title: "Notifications",
            url: `/${state.context.tenantId}/settings/notifications`,
          },
          {
            title: "Plans",
            url: `/${state.context.tenantId}/settings/plans`,
          },
          {
            title: "Billing",
            url: `/${state.context.tenantId}/settings/billing`,
          },
        ],
      },
      {
        title: "Chatbot Config",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/chatbot-config`,
        icon: Settings,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/chatbot-config`
        ),
      },
      {
        title: "Conversations",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/conversations`,
        icon: MessageSquareCode,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/conversations`
        ),
      },
      {
        title: "Appearance",
          url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/appearance`,
        icon: MonitorCog,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/appearance`
        ),
      },
      {
        title: "Prompt",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/prompt`,
        icon: Terminal,
        isActive: isPathActive(`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/prompt`),
      },
      {
        title: "Lead Form",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/lead-forms`,
        icon: BookText,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/lead-forms`
        ),
      },
      {
        title: "Invoices",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/invoices`,
        icon: Receipt,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/invoices`
        ),
      },
      {
        title: "Embedding",
        url: `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/embeded`,
        icon: Code,
        isActive: isPathActive(
          `/${state.context.tenantId}/${state.context.selectedChatbot?._id}/embeded`
        ),
      },
      
    ],
  };
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-sidebar-background ring-0 focus:ring-0 !border-0"
    >
      <SidebarHeader className="bg-sidebar-background">
        <TeamSwitcher  />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-background">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-sidebar-background">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
