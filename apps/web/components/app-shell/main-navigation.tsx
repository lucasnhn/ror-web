import Link from "next/link";
import { NavigationItem } from "./navigation-item";

const DashboardIcon = (
  <svg
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


export function AppShellMainNavigation() {
    return (
      <nav className="flex flex-col text-sm">
        <ul>
          <NavigationItem label="Dashboard" href="/dashboard" icon={DashboardIcon} />
          <NavigationItem label="Statistics" icon={StatisticsIcon}>
            <ul>
              <li><Link href="/metrics">Metrics</Link></li>
            </ul>
          </NavigationItem>
          <NavigationItem label="Economy" icon={EconomyIcon}>
            <ul>
              <li><Link href="/economy">Price list</Link></li>
            </ul>
          </NavigationItem>
          <NavigationItem label="Administration" icon={AdministrationIcon}>
            <ul>
              <li><Link href="/admin/data-centers">Data centers</Link></li>
              <li><Link href="/admin/policy-reports">Policy reports</Link></li>
              <li><Link href="/admin/price-list">Price list</Link></li>
              <li><Link href="/admin/projects">Projects</Link></li>
              <li><Link href="/admin/vulnerability-reports">Vulnerability reports</Link></li>
              <li><Link href="/admin/workspaces">Workspaces</Link></li>
            </ul>
          </NavigationItem>
          <NavigationItem label="Help" icon={HelpIcon}>
            <ul>
              <li><Link href="/help/documentation">Documentation</Link></li>
              <li><Link href="/help/about">About</Link></li>
              <li><Link href="/help/release-notes">Release notes</Link></li>
            </ul>
          </NavigationItem>
        </ul>
      </nav>
    );
}
