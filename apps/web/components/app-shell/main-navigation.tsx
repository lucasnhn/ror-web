import { NavigationItem } from "./navigation-item";

const DashboardIcon = (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="w-4 h-4 text-current"
    viewBox="0 0 24 24"
  >
    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
  </svg>
);

const StatisticsIcon = (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="w-4 h-4 text-current"
    viewBox="0 0 24 24"
  >
    <path d="M3 3v16a2 2 0 0 0 2 2h16M18 17V9M13 17V5M8 17v-3"></path>
  </svg>
);

const EconomyIcon = (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="w-4 h-4 text-current"
    viewBox="0 0 24 24"
  >
    <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path>
    <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9M2 16l6 6"></path>
    <circle cx="16" cy="9" r="2.9"></circle>
    <circle cx="6" cy="5" r="3"></circle>
  </svg>
);

const AdministrationIcon = (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="w-4 h-4 text-current"
    viewBox="0 0 24 24"
  >
    <path d="M20 7h-9M14 17H5"></path>
    <circle cx="17" cy="17" r="3"></circle>
    <circle cx="7" cy="7" r="3"></circle>
  </svg>
)

const HelpIcon = (
  <svg
    aria-hidden="true"
    role="img"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4 text-current"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"></path>
    </svg>
)

const statistics = [
  {
    label: "Metrics",
    href: "/metrics",
  }
]

const economy = [
  {
    label: "Price list",
    href: "/price-list",
  }
]

const administration = [
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

const help = [
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

export function MainNavigation() {
    return (
      <nav>
        <ul className="flex flex-col gap-1">
          <NavigationItem label="Overview" href="/dashboard" icon={DashboardIcon} />
          <NavigationItem label="Statistics" subNav={statistics} icon={StatisticsIcon} />
          <NavigationItem label="Economy" subNav={economy} icon={EconomyIcon} />
          <NavigationItem label="Administration" subNav={administration} icon={AdministrationIcon} />
          <NavigationItem label="Help" subNav={help} icon={HelpIcon} />
        </ul>
      </nav>
    );
}
