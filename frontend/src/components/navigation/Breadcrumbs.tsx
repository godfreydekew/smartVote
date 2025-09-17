import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

interface BreadcrumbRoute {
  path: string;
  label: string;
  visible?: boolean;
}

export interface BreadcrumbsProps {
  routes?: BreadcrumbRoute[];
  className?: string;
}

const defaultRouteMap: Record<string, BreadcrumbRoute[]> = {
  '/dashboard': [{ path: '/dashboard', label: 'dashboard', visible: true }],
  '/admin': [
    { path: '/dashboard', label: 'dashboard', visible: true },
    { path: '/admin', label: 'admin', visible: true },
  ],
  '/admin/elections/create': [
    { path: '/dashboard', label: 'dashboard', visible: false },
    { path: '/admin', label: 'admin', visible: true },
    { path: '/admin/elections/create', label: 'createElection', visible: true },
  ],
  '/elections': [
    { path: '/dashboard', label: 'dashboard', visible: true },
    { path: '/elections', label: 'elections', visible: true },
  ],
  '/profile': [
    { path: '/dashboard', label: 'dashboard', visible: true },
    { path: '/profile', label: 'profile', visible: true },
  ],
};

export function Breadcrumbs({ routes, className }: BreadcrumbsProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  // Dynamic breadcrumb generation based on current path
  const getBreadcrumbRoutes = () => {
    if (routes) {
      return routes;
    }

    // If this is an election details page
    if (location.pathname.match(/\/election\/(.+)/)) {
      const electionId = location.pathname.split('/')[2];
      return [
        { path: '/dashboard', label: 'dashboard', visible: !isMobile },
        { path: '/dashboard', label: 'elections', visible: true },
        { path: `/election/${electionId}`, label: 'electionDetails', visible: true },
      ];
    }

    // If this is an election edit page
    if (location.pathname.match(/\/elections\/(.+)\/edit/)) {
      const electionId = location.pathname.split('/')[2];
      return [
        { path: '/dashboard', label: 'dashboard', visible: !isMobile },
        { path: '/admin', label: 'admin', visible: !isMobile },
        { path: '/admin', label: 'elections', visible: true },
        { path: `/elections/${electionId}/edit`, label: 'editElection', visible: true },
      ];
    }

    // Default paths
    return (
      defaultRouteMap[location.pathname] || [
        { path: '/dashboard', label: 'dashboard', visible: true },
        { path: location.pathname, label: 'currentPage', visible: true },
      ]
    );
  };

  const breadcrumbRoutes = getBreadcrumbRoutes();
  const visibleRoutes = breadcrumbRoutes.filter((route) => route.visible !== false);
  const hasCollapsed = breadcrumbRoutes.length !== visibleRoutes.length;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {visibleRoutes.map((route, index) => (
          <React.Fragment key={route.path + index}>
            {index === 0 && hasCollapsed && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}

            <BreadcrumbItem>
              {index === visibleRoutes.length - 1 ? (
                <BreadcrumbPage>{t(`navigation.${route.label}`)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={route.path}>{t(`navigation.${route.label}`)}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < visibleRoutes.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
