import { ReactElement } from "react";
import { AdministrationIcon, DashboardIcon, EconomyIcon, HelpIcon, StatisticsIcon } from "./icons";

export interface Route {
  label: string;
  href: string;
}

export interface TopLevelRouteWithSubRoutes {
  label: string;
  items: Route[];
}

export interface TopLevelRoute {
  label: string;
  href: string;
  icon?: ReactElement;
}

export const routes: (TopLevelRoute | TopLevelRouteWithSubRoutes)[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: DashboardIcon
  },
  {
    label: "Statistics",
    icon: StatisticsIcon,
    items: [
      {
        label: "Metrics",
        href: "/metrics"
      }
    ]
  },
  {
    label: "Economy",
    icon: EconomyIcon,
    items: [
      {
        label: "Price list",
        href: "/price-list"
      }
    ]
  },
  {
    label: "Administration",
    icon: AdministrationIcon,
    items: [
      {
        label: "Data centers",
        href: "/admin/data-centers"
      },
      {
        label: "Policy reports",
        href: "/admin/policy-reports"
      },
      {
        label: "Price list",
        href: "/admin/price-list"
      },
      {
        label: "Projects",
        href: "/admin/projects"
      },
      {
        label: "Vulnerability reports",
        href: "/admin/vulnerability-reports"
      },
      {
        label: "Workspaces",
        href: "/admin/workspaces"
      }
    ]
  },
  {
    label: "Help",
    icon: HelpIcon,
    items: [
      {
        label: "Documentation",
        href: "/help/documentation"
      },
      {
        label: "About",
        href: "/help/about"
      },
      {
        label: "Release notes",
        href: "/help/release-notes"
      }
    ]
  }
]
