import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar.tsx";
import { SiteHeader } from "@/components/site-header.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { useController } from "@/libraries/controller.ts";

import { AppController } from "./app.controller.ts";

export function AppView() {
  const [{ authenticated }, loading] = useController(AppController);
  if (loading === true) {
    return <div>Loading ...</div>;
  }
  if (authenticated === false) {
    return <div>Unauthenticated</div>;
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
