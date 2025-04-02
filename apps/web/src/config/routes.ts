export const routes = {
  auth: {
    signIn: {
      label: 'Sign in',
      getHref: () => '/sign-in',
    },
    signOut: {
      label: 'Sign out',
      getHref: () => '/api/auth/signout',
    },
  },
  app: {
    overview: {
      label: 'Overview',
      getHref: () => '/clusters',
    },
    clusters: {
      label: 'Clusters',
      getHref: () => '/clusters',
    },
    cluster: {
      label: 'Cluster',
      getHref: (id: string) => `/clusters/${id}`,
    },
    clusterIngresses: {
      label: 'Ingresses',
      getHref: (id: string) => `/clusters/${id}/ingresses`,
    },
    clusterNodePools: {
      label: 'Node pools',
      getHref: (id: string) => `/clusters/${id}/node-pools`,
    },
    clusterPolicies: {
      label: 'Policies',
      getHref: (id: string) => `/clusters/${id}/policies`,
    },
    clusterVulnerabilities: {
      label: 'Vulnerabilities',
      getHref: (id: string) => `/clusters/${id}/vulnerabilities`,
    },
    clusterCompliance: {
      label: 'Compliance',
      getHref: (id: string) => `/clusters/${id}/compliance`,
    },
    clusterAbout: {
      label: 'About',
      getHref: (id: string) => `/clusters/${id}/about`,
    },
    clusterRawData: {
      label: 'Raw data',
      getHref: (id: string) => `/clusters/${id}/raw-data`,
    },
    metrics: {
      label: 'Metrics',
      getHref: () => '/statistics/metrics',
    },
    priceList: {
      label: 'Price list',
      getHref: () => '/economy/price-list',
    },
    dataCenters: {
      label: 'Data centers',
      getHref: () => '/admin/data-centers',
    },
    policyReports: {
      label: 'Policy reports',
      getHref: () => '/admin/policy-reports',
    },
    adminPriceList: {
      label: 'Price list',
      getHref: () => '/admin/price-list',
    },
    projects: {
      label: 'Projects',
      getHref: () => '/admin/projects',
    },
    vulnerabilityReports: {
      label: 'Vulnerability reports',
      getHref: () => '/admin/vulnerability-reports',
    },
    workspaces: {
      label: 'Workspaces',
      getHref: () => '/admin/workspaces',
    },
    documentation: {
      label: 'Documentation',
      getHref: () => '/help/documentation',
    },
    about: {
      label: 'About',
      getHref: () => '/help/about',
    },
    releaseNotes: {
      label: 'Release notes',
      getHref: () => '/help/release-notes',
    },
    profile: {
      label: 'Profile',
      getHref: () => '/profile',
    },
  },
} as const
