"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/interfaces";
import { useMachine } from "@xstate/react";
import signOutMachine from "@/machines/signOutMachine/signOutMachine";


export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const session = useSession();
  const completeSession = session.data || ({ user: {} } as unknown as ExtendedSession);
  const { user: sessionUser } = completeSession;
  const [signOutState, send] = useMachine(signOutMachine);
  const handleLogout = () => {
    const extendedSession = completeSession as ExtendedSession;
    if (extendedSession?.refreshToken) {
      send({ type: 'SIGN_OUT', refreshToken: extendedSession.refreshToken });
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:bg-sidebar-accent">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={sessionUser?.image || user.avatar}
                  alt={sessionUser?.name || ""}
                />
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {sessionUser?.name || ""}
                </span>
                <span className="truncate text-xs">
                  {sessionUser?.email || ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={sessionUser?.image || user.avatar}
                    alt={sessionUser?.name || ""}
                  />
                  <AvatarFallback className="rounded-lg"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {sessionUser?.name || ""}
                  </span>
                  <span className="truncate text-xs">
                    {sessionUser?.email || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-accent">
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-accent">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent">
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={signOutState.matches('loading') || signOutState.matches('signingOutSession')}
              className="hover:bg-accent"
            >
              <LogOut />
              {signOutState.matches('loading') ? 'Signing out...' : 
               signOutState.matches('signingOutSession') ? 'Signing out session...' : 
               'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
