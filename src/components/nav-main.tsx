"use client";

import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { NavMainProps, NavItem } from "@/types/interfaces";



export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  // Check if a menu item or its children are active
  const isMenuActive = (item: NavItem) => {
    const isMainPathActive = pathname === item.url;
    const isSubPathActive = item.items?.some(
      (subItem) => pathname === subItem.url
    );
    return isMainPathActive || isSubPathActive;
  };

  // Handle menu click
  const handleMenuClick = (title: string) => {
    setOpenMenus((prev) => {
      if (prev.includes(title)) {
        return prev.filter((item) => item !== title);
      }
      return [...prev, title];
    });
  };

  React.useEffect(() => {
    // Open menus based on current path
    const activeMenus = items
      .filter((item) => isMenuActive(item))
      .map((item) => item.title);
    setOpenMenus(activeMenus);
  }, [pathname, items]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isMenuActive(item);
          const isOpen = openMenus.includes(item.title);

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={() => handleMenuClick(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {item.items ? (
                    // If item has subitems, use button
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-sidebar-accent hover:bg-sidebar-accent"
                          : "hover:bg-sidebar-accent"
                      }
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight
                        className={`ml-auto transition-transform duration-200 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  ) : (
                    // If no subitems, use Link
                    <Link href={item.url} passHref>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={
                          isActive
                            ? "bg-sidebar-accent hover:bg-sidebar-accent"
                            : "hover:bg-sidebar-accent"
                        }
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  )}
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link href={subItem.url} passHref>
                            <SidebarMenuSubButton
                              asChild
                              className={
                                pathname === subItem.url
                                  ? "bg-sidebar-accent hover:bg-sidebar-accent"
                                  : "hover:bg-sidebar-accent"
                              }
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
