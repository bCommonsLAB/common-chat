'use client';

import * as React from "react";
import { MessageSquare, Database, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <SignedIn>
      <SidebarProvider defaultOpen>
        <SidebarContainer>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold">Navigation</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menü</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/" passHref legacyBehavior>
                      <SidebarMenuButton
                        isActive={pathname === "/"}
                        tooltip="Chatbots"
                      >
                        <LayoutGrid className="h-4 w-4" />
                        <span>Chatbots</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/manage/chatbots" passHref legacyBehavior>
                      <SidebarMenuButton
                        isActive={pathname === "/manage/chatbots"}
                        tooltip="Chatbots verwalten"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chatbots verwalten</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/manage/knowledgebase" passHref legacyBehavior>
                      <SidebarMenuButton
                        isActive={pathname === "/manage/knowledgebase"}
                        tooltip="Knowledgebase"
                      >
                        <Database className="h-4 w-4" />
                        <span>Knowledgebase</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="text-xs text-muted-foreground">Version 1.0.0</div>
          </SidebarFooter>
        </SidebarContainer>
      </SidebarProvider>
    </SignedIn>
  );
} 