import { NavigationGroup } from './group'
import { NavigationItem } from './item'
import { routes } from '@/config/routes'
import {
  AdministrationIcon,
  ClustersIcon,
  DashboardIcon,
  EconomyIcon,
  HelpIcon,
  StatisticsIcon,
} from '@/components/ui/icons'

import s from './navigation.module.scss'
import Link from 'next/link'

const {
  overview,
  clusters,
  metrics,
  priceList,
  dataCenters,
  policyReports,
  adminPriceList,
  projects,
  vulnerabilityReports,
  workspaces,
  documentation,
  about,
  releaseNotes,
} = routes.app

export function Navigation() {
  return (
    <nav className={s.nav}>
      <ul className={s.list}>
        <NavigationItem label={overview.label} href={overview.getHref()} icon={<DashboardIcon />} />
        <NavigationItem label={clusters.label} href={clusters.getHref()} icon={<ClustersIcon />} />
        <NavigationGroup label='Statistics' icon={<StatisticsIcon />}>
          <ul>
            <li>
              <Link href={metrics.getHref()}>{metrics.label}</Link>
            </li>
          </ul>
        </NavigationGroup>
        <NavigationGroup label='Economy' icon={<EconomyIcon />}>
          <ul>
            <li>
              <Link href={priceList.getHref()}>{priceList.label}</Link>
            </li>
          </ul>
        </NavigationGroup>
        <NavigationGroup label='Administration' icon={<AdministrationIcon />}>
          <ul>
            <li>
              <Link href={dataCenters.getHref()}>{dataCenters.label}</Link>
            </li>
            <li>
              <Link href={policyReports.getHref()}>{policyReports.label}</Link>
            </li>
            <li>
              <Link href={adminPriceList.getHref()}>{adminPriceList.label}</Link>
            </li>
            <li>
              <Link href={projects.getHref()}>{projects.label}</Link>
            </li>
            <li>
              <Link href={vulnerabilityReports.getHref()}>{vulnerabilityReports.label}</Link>
            </li>
            <li>
              <Link href={workspaces.getHref()}>{workspaces.label}</Link>
            </li>
          </ul>
        </NavigationGroup>
        <NavigationGroup label='Help' icon={<HelpIcon />}>
          <ul>
            <li>
              <Link href={documentation.getHref()}>{documentation.label}</Link>
            </li>
            <li>
              <Link href={about.getHref()}>{about.label}</Link>
            </li>
            <li>
              <Link href={releaseNotes.getHref()}>{releaseNotes.label}</Link>
            </li>
          </ul>
        </NavigationGroup>
      </ul>
    </nav>
  )
}
