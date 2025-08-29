"use client";

import { 
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
        
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
            size="lg" 
            className={`sidebar-button sidebar-button-hover sidebar-button-active ${currentView === ViewType.QUOTE_CONFIGURER ? 'sidebar-button-selected' : ''}`}
            onClick={() => setCurrentView(ViewType.QUOTE_CONFIGURER)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configure Quotes</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
            size="lg" 
            className={`sidebar-button sidebar-button-hover sidebar-button-active ${currentView === ViewType.COMPANIES ? 'sidebar-button-selected' : ''}`}
            onClick={() => setCurrentView(ViewType.COMPANIES)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Companies</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
            size="lg" 
            className={`sidebar-button sidebar-button-hover sidebar-button-active ${currentView === ViewType.PRICING_PLANS ? 'sidebar-button-selected' : ''}`}
            onClick={() => setCurrentView(ViewType.PRICING_PLANS)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Pricing Plans</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

      </SidebarMenu>
    </Sidebar>
  );
}

