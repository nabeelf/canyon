"use client";

import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  Sidebar
} from '@/components/ui/sidebar';
import { ViewType } from '@/app/types';
import { useRouter, usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  QuotesIcon, 
  CreateQuoteIcon, 
  ConfigureQuotesIcon, 
  CompaniesIcon, 
  PricingPlansIcon 
} from '@/components/ui/icons';

export function SidebarWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (view: ViewType) => {
    switch (view) {
      case ViewType.QUOTES:
        router.push('/quotes');
        break;
      case ViewType.CREATE_QUOTE:
        router.push('/create-quote');
        break;
      case ViewType.QUOTE_CONFIGURER:
        router.push('/quote-configurer');
        break;
      case ViewType.COMPANIES:
        router.push('/companies');
        break;
      case ViewType.PRICING_PLANS:
        router.push('/pricing-plans');
        break;
      case ViewType.HOME:
      default:
        router.push('/');
        break;
    }
  };

  // Determine current view based on pathname
  const getCurrentViewFromPath = (): ViewType => {
    switch (pathname) {
      case '/quotes':
        return ViewType.QUOTES;
      case '/create-quote':
        return ViewType.CREATE_QUOTE;
      case '/quote-configurer':
        return ViewType.QUOTE_CONFIGURER;
      case '/companies':
        return ViewType.COMPANIES;
      case '/pricing-plans':
        return ViewType.PRICING_PLANS;
      case '/':
      default:
        return ViewType.HOME;
    }
  };

  const activeView = getCurrentViewFromPath();

  return (
    <Sidebar>
      <SidebarMenu className="mt-20">
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
                    size="lg" 
                    className={`sidebar-button sidebar-button-hover sidebar-button-active ${activeView === ViewType.HOME ? 'sidebar-button-selected' : ''}`}
                    onClick={() => handleNavigation(ViewType.HOME)}
                  >
            <div className="flex items-center gap-3">
              <HomeIcon />
              <span>Home</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
              <SidebarMenuButton 
                 size="lg" 
                 className={`sidebar-button sidebar-button-hover sidebar-button-active ${activeView === ViewType.QUOTES ? 'sidebar-button-selected' : ''}`}
                 onClick={() => handleNavigation(ViewType.QUOTES)}
               >
            <div className="flex items-center gap-3">
              <QuotesIcon />
              <span>Quotes</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
            <SidebarMenuItem className="px-4">
               <SidebarMenuButton 
                 size="lg" 
                 className={`sidebar-button sidebar-button-hover sidebar-button-active ${activeView === ViewType.CREATE_QUOTE ? 'sidebar-button-selected' : ''}`}
                 onClick={() => handleNavigation(ViewType.CREATE_QUOTE)}
               >
            <div className="flex items-center gap-3">
              <CreateQuoteIcon />
              <span>Create Quote</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
            size="lg" 
            className={`sidebar-button sidebar-button-hover sidebar-button-active ${activeView === ViewType.QUOTE_CONFIGURER ? 'sidebar-button-selected' : ''}`}
            onClick={() => handleNavigation(ViewType.QUOTE_CONFIGURER)}
          >
            <div className="flex items-center gap-3">
              <ConfigureQuotesIcon />
              <span>Configure Quotes</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
            size="lg" 
            className={`sidebar-button sidebar-button-hover sidebar-button-active ${activeView === ViewType.COMPANIES ? 'sidebar-button-selected' : ''}`}
            onClick={() => handleNavigation(ViewType.COMPANIES)}
          >
            <div className="flex items-center gap-3">
              <CompaniesIcon />
              <span>Companies</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem className="px-4">
          <SidebarMenuButton 
            size="lg" 
            className={`sidebar-button sidebar-button-hover sidebar-button-active ${activeView === ViewType.PRICING_PLANS ? 'sidebar-button-selected' : ''}`}
            onClick={() => handleNavigation(ViewType.PRICING_PLANS)}
          >
            <div className="flex items-center gap-3">
              <PricingPlansIcon />
              <span>Pricing Plans</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

      </SidebarMenu>
    </Sidebar>
  );
}

