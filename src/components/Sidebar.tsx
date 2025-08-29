"use client";

import { 
  Sidebar as SidebarUI, 
  SidebarProvider, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  Sidebar
} from '@/components/ui/sidebar';
import { ViewType } from '@/app/page';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function SidebarWrapper({ currentView, setCurrentView }: SidebarProps) {
  return (
    <Sidebar>
      <SidebarMenu className="mt-20">
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
                    size="lg" 
                    className={`sidebar-button sidebar-button-hover sidebar-button-active ${currentView === ViewType.HOME ? 'sidebar-button-selected' : ''}`}
                    onClick={() => setCurrentView(ViewType.HOME)}
                  >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
              <SidebarMenuButton 
                 size="lg" 
                 className={`sidebar-button sidebar-button-hover sidebar-button-active ${currentView === ViewType.QUOTES ? 'sidebar-button-selected' : ''}`}
                 onClick={() => setCurrentView(ViewType.QUOTES)}
               >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Quotes</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
            <SidebarMenuItem className="px-4">
               <SidebarMenuButton 
                 size="lg" 
                 className={`sidebar-button sidebar-button-hover sidebar-button-active ${currentView === ViewType.CREATE_QUOTE ? 'sidebar-button-selected' : ''}`}
                 onClick={() => setCurrentView(ViewType.CREATE_QUOTE)}
               >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Quote</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

      </SidebarMenu>
    </Sidebar>
  );
}

