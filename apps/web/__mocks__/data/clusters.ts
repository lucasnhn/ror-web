/**
 * clusters.ts - Mock data for Kubernetes clusters
 *
 * This file dynamically generates an array of mock Kubernetes clusters for use in local development and testing.
 * The data is used by MSW handlers to simulate paginated API responses (offset/limit).
 *
 * - Generates a fixed number of clusters with unique clusterId and metadata
 * - Used for infinite scroll, pagination, and frontend API testing
 * - No static cluster objects; all clusters are generated programmatically
 */
import { faker } from '@faker-js/faker'
import { machine } from 'os'

/**
 * Mock data for Clusters v1.
 */
// export const clustersVersion1 = [
//   {
//     id: '6523967984fddd1597f6166f',
//     identifier: 'aaa-001-dev-kgfh',
//     clusterIdOld: '',
//     acl: {
//       accessGroups: [],
//     },
//     clusterId: 'aaa-001-dev-kgfh',
//     clusterName: 'aaa-001-dev',
//     workspaceId: '65219b35981e0fedb309d1c9',
//     workspace: {
//       id: '65219b35981e0fedb309d1c9',
//       name: 'Azure',
//       datacenterId: '65219a62981e0fedb309cce5',
//       datacenter: {
//         id: '65219a62981e0fedb309cce5',
//         name: 'norwayeast',
//         provider: 'aaa',
//         location: {
//           id: '',
//           region: 'Norway East',
//           country: 'Norway',
//         },
//         apiEndpoint: '',
//       },
//     },
//     environment: 'dev',
//     metrics: {
//       priceMonth: -1,
//       priceYear: -12,
//       cpu: 0,
//       memory: 6072565760,
//       cpuConsumed: 117,
//       memoryConsumed: 1667194880,
//       cpuPercentage: 0,
//       memoryPercentage: 27,
//       nodePoolCount: 1,
//       nodeCount: 1,
//       clusterCount: 1,
//     },
//     topology: {
//       controlPlaneEndpoint: '',
//       egressIp: faker.internet.ipv4(),
//       controlPlane: {
//         nodes: null,
//         metrics: {
//           priceMonth: 0,
//           priceYear: 0,
//           cpu: 0,
//           memory: 0,
//           cpuConsumed: 0,
//           memoryConsumed: 0,
//           cpuPercentage: 0,
//           memoryPercentage: 0,
//           nodePoolCount: 0,
//           nodeCount: 0,
//           clusterCount: 0,
//         },
//       },
//       nodePools: [
//         {
//           name: 'default',
//           machineClass: '',
//           metrics: {
//             priceMonth: -1,
//             priceYear: -12,
//             cpu: 0,
//             memory: 6072565760,
//             cpuConsumed: 117,
//             memoryConsumed: 1667194880,
//             cpuPercentage: 0,
//             memoryPercentage: 27,
//             nodePoolCount: 0,
//             nodeCount: 1,
//             clusterCount: 0,
//           },
//           nodes: [
//             {
//               name: 'aaa-default-20285638-vmss000003',
//               role: 'worker',
//               created: '2025-02-26T00:27:57Z',
//               osImage: 'Ubuntu 22.04.5 LTS',
//               machineName: 'aaa-default-20285638-vmss000003',
//               metrics: {
//                 priceMonth: -1,
//                 priceYear: -12,
//                 cpu: 0,
//                 memory: 6072565760,
//                 cpuConsumed: 117,
//                 memoryConsumed: 1667194880,
//                 cpuPercentage: 0,
//                 memoryPercentage: 27,
//                 nodePoolCount: 0,
//                 nodeCount: 0,
//                 clusterCount: 0,
//               },
//               architecture: 'amd64',
//               containerRuntimeVersion: 'containerd://1.7.25-1',
//               kernelVersion: '5.15.0-1079-azure',
//               kubeProxyVersion: 'v1.30.9',
//               kubeletVersion: 'v1.30.9',
//               operatingSystem: 'linux',
//               machineClass: '',
//             },
//           ],
//         },
//       ],
//     },
//     versions: {
//       kubernetes: 'v1.30.9',
//       nhnTooling: {
//         version: 'Missing ...',
//         branch: 'Missing ...',
//         environment: 'dev',
//       },
//       agent: {
//         version: '1.1.355',
//         sha: '7ec96e38',
//       },
//     },
//     ingresses: null,
//     updated: '0001-01-01T00:00:00Z',
//     created: '2023-10-09T05:10:10Z',
//     firstObserved: '2025-03-03T13:28:54.941Z',
//     lastObserved: sub(new Date(), { minutes: 5 }).toISOString(),
//     healthStatus: {
//       health: 1,
//       messages: null,
//     },
//     createdBy: '',
//     splunkIndex: '',
//     config: {
//       versions: null,
//       overrides: null,
//       projectMetadata: {
//         roles: null,
//         billing: {
//           workorder: '',
//         },
//         serviceTags: null,
//       },
//     },
//     metadata: {
//       criticality: 0,
//       sensitivity: 0,
//       description: '',
//       serviceTags: null,
//       billing: {
//         workorder: '',
//       },
//       roles: null,
//     },
//     status: {
//       state: '',
//       phase: '',
//       conditions: null,
//     },
//   },
//   {
//     id: '66792637962733bd96c8a2f7',
//     identifier: 'aaa-002-dev-9oz9',
//     clusterIdOld: '',
//     acl: {
//       accessGroups: ['admin@drift.example.com', 'interns@example.com'],
//     },
//     clusterId: 'aaa-002-dev-9oz9',
//     clusterName: 'aaa-002-dev',
//     workspaceId: '66792637962733bd96c8a2f6',
//     workspace: {
//       id: '66792637962733bd96c8a2f6',
//       name: 'noe01-aaa-002-dev',
//       datacenterId: faker.string.uuid(),
//       datacenter: {
//         id: faker.string.uuid(),
//         name: 'noe01',
//         provider: 'tanzu',
//         location: {
//           id: '',
//           region: 'Trøndelag',
//           country: 'Norway',
//         },
//         apiEndpoint: 'ptr1-w02-cl02-api.example.com',
//       },
//     },
//     environment: 'test',
//     metrics: {
//       priceMonth: 3597,
//       priceYear: 43164,
//       cpu: 6,
//       memory: 24661540864,
//       cpuConsumed: 489,
//       memoryConsumed: 13933252608,
//       cpuPercentage: 8,
//       memoryPercentage: 56,
//       nodePoolCount: 1,
//       nodeCount: 3,
//       clusterCount: 1,
//     },
//     topology: {
//       controlPlaneEndpoint: '10.204.100.27:6443',
//       egressIp: '10.204.104.42',
//       controlPlane: {
//         nodes: [
//           {
//             name: 'aaa-002-dev-control-plane-8qqmp',
//             role: 'control-plane',
//             created: '2025-02-20T09:16:24Z',
//             osImage: 'VMware Photon OS/Linux',
//             machineName: 'aaa-002-dev-control-plane-8qqmp',
//             metrics: {
//               priceMonth: 0,
//               priceYear: 0,
//               cpu: 2,
//               memory: 8220520448,
//               cpuConsumed: 283,
//               memoryConsumed: 7324516352,
//               cpuPercentage: 14,
//               memoryPercentage: 89,
//               nodePoolCount: 0,
//               nodeCount: 0,
//               clusterCount: 0,
//             },
//             architecture: 'amd64',
//             containerRuntimeVersion: 'containerd://1.6.28',
//             kernelVersion: '6.1.83-4.ph5',
//             kubeProxyVersion: 'v1.28.7+vmware.1-fips.1',
//             kubeletVersion: 'v1.28.7+vmware.1-fips.1',
//             operatingSystem: 'linux',
//             machineClass: '',
//           },
//         ],
//         metrics: {
//           priceMonth: 0,
//           priceYear: 0,
//           cpu: 2,
//           memory: 8220520448,
//           cpuConsumed: 283,
//           memoryConsumed: 7324516352,
//           cpuPercentage: 14,
//           memoryPercentage: 89,
//           nodePoolCount: 0,
//           nodeCount: 1,
//           clusterCount: 0,
//         },
//       },
//       nodePools: [
//         {
//           name: 'workers',
//           machineClass: 'best-effort-medium',
//           metrics: {
//             priceMonth: 3597,
//             priceYear: 43164,
//             cpu: 6,
//             memory: 24661540864,
//             cpuConsumed: 489,
//             memoryConsumed: 13933252608,
//             cpuPercentage: 8,
//             memoryPercentage: 56,
//             nodePoolCount: 0,
//             nodeCount: 3,
//             clusterCount: 0,
//           },
//           nodes: [
//             {
//               name: 'aaa-002-dev-workers-gcr2g-84ndq-4xxcj',
//               role: 'worker',
//               created: '2025-02-20T09:25:43Z',
//               osImage: 'VMware Photon OS/Linux',
//               machineName: 'aaa-002-dev-workers-gcr2g-84ndq-4xxcj',
//               metrics: {
//                 priceMonth: 1199,
//                 priceYear: 14388,
//                 cpu: 2,
//                 memory: 8220520448,
//                 cpuConsumed: 120,
//                 memoryConsumed: 4477046784,
//                 cpuPercentage: 6,
//                 memoryPercentage: 54,
//                 nodePoolCount: 0,
//                 nodeCount: 0,
//                 clusterCount: 0,
//               },
//               architecture: 'amd64',
//               containerRuntimeVersion: 'containerd://1.6.28',
//               kernelVersion: '6.1.83-4.ph5',
//               kubeProxyVersion: 'v1.28.7+vmware.1-fips.1',
//               kubeletVersion: 'v1.28.7+vmware.1-fips.1',
//               operatingSystem: 'linux',
//               machineClass: 'best-effort-medium',
//             },
//             {
//               name: 'aaa-002-dev-workers-gcr2g-84ndq-64d5p',
//               role: 'worker',
//               created: '2025-02-20T09:31:26Z',
//               osImage: 'VMware Photon OS/Linux',
//               machineName: 'aaa-002-dev-workers-gcr2g-84ndq-64d5p',
//               metrics: {
//                 priceMonth: 1199,
//                 priceYear: 14388,
//                 cpu: 2,
//                 memory: 8220508160,
//                 cpuConsumed: 128,
//                 memoryConsumed: 3763326976,
//                 cpuPercentage: 6,
//                 memoryPercentage: 45,
//                 nodePoolCount: 0,
//                 nodeCount: 0,
//                 clusterCount: 0,
//               },
//               architecture: 'amd64',
//               containerRuntimeVersion: 'containerd://1.6.28',
//               kernelVersion: '6.1.83-4.ph5',
//               kubeProxyVersion: 'v1.28.7+vmware.1-fips.1',
//               kubeletVersion: 'v1.28.7+vmware.1-fips.1',
//               operatingSystem: 'linux',
//               machineClass: 'best-effort-medium',
//             },
//             {
//               name: 'aaa-002-dev-workers-gcr2g-84ndq-bv57r',
//               role: 'worker',
//               created: '2025-02-20T09:38:48Z',
//               osImage: 'VMware Photon OS/Linux',
//               machineName: 'aaa-002-dev-workers-gcr2g-84ndq-bv57r',
//               metrics: {
//                 priceMonth: 1199,
//                 priceYear: 14388,
//                 cpu: 2,
//                 memory: 8220512256,
//                 cpuConsumed: 241,
//                 memoryConsumed: 5692878848,
//                 cpuPercentage: 12,
//                 memoryPercentage: 69,
//                 nodePoolCount: 0,
//                 nodeCount: 0,
//                 clusterCount: 0,
//               },
//               architecture: 'amd64',
//               containerRuntimeVersion: 'containerd://1.6.28',
//               kernelVersion: '6.1.83-4.ph5',
//               kubeProxyVersion: 'v1.28.7+vmware.1-fips.1',
//               kubeletVersion: 'v1.28.7+vmware.1-fips.1',
//               operatingSystem: 'linux',
//               machineClass: 'best-effort-medium',
//             },
//           ],
//         },
//       ],
//     },
//     versions: {
//       kubernetes: 'v1.28.7',
//       nhnTooling: {
//         version: '1.6.18-rc.1',
//         branch: 'v1.*-0',
//         environment: 'test',
//       },
//       agent: {
//         version: '0.1.749',
//         sha: 'd529458a',
//       },
//     },
//     ingresses: [
//       {
//         uid: faker.string.uuid(),
//         health: 1,
//         name: 'argocd-server',
//         namespace: 'argocd',
//         class: 'avi-ingress-class-datacenter',
//         ingressrules: [
//           {
//             hostname: 'argo.aaa-002-dev.noe01-aaa-002-dev.sky.example.com',
//             ipaddresses: [faker.internet.ipv4()],
//             rules: [
//               {
//                 path: '/',
//                 service: {
//                   name: 'argocd-server',
//                   type: 'NodePort',
//                   selector: 'argocd-server',
//                   ports: [
//                     {
//                       name: 'http',
//                       nodeport: '30080',
//                       protocol: 'TCP',
//                     },
//                     {
//                       name: 'https',
//                       nodeport: '30443',
//                       protocol: 'TCP',
//                     },
//                   ],
//                   endpoints: [
//                     {
//                       nodename: 'aaa-002-dev-workers-gcr2g-84ndq-bv57r',
//                       podnamespace: 'argocd-server-74c7d8745c-fthzb',
//                     },
//                   ],
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         uid: faker.string.uuid(),
//         health: 1,
//         name: 'grafana-somenett',
//         namespace: 'prometheus-operator',
//         class: 'avi-ingress-class-datacenter',
//         ingressrules: [
//           {
//             hostname: 'grafana.aaa-002-dev.noe01-aaa-002-dev.sky.example.com',
//             ipaddresses: [faker.internet.ipv4()],
//             rules: [
//               {
//                 path: '/',
//                 service: {
//                   name: 'grafana-publisering',
//                   type: 'NodePort',
//                   selector: 'grafana',
//                   ports: [
//                     {
//                       name: 'service',
//                       nodeport: '31251',
//                       protocol: 'TCP',
//                     },
//                   ],
//                   endpoints: [
//                     {
//                       nodename: 'aaa-002-dev-workers-gcr2g-84ndq-4xxcj',
//                       podnamespace: 'prometheus-grafana-6556dd7b87-r78v8',
//                     },
//                   ],
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     ],
//     updated: '0001-01-01T00:00:00Z',
//     created: '2024-06-24T07:13:19Z',
//     firstObserved: '2024-06-24T07:54:31.64Z',
//     lastObserved: sub(new Date(), { minutes: 12 }).toLocaleString(),
//     healthStatus: {
//       health: 2,
//       messages: null,
//     },
//     createdBy: '',
//     splunkIndex: '',
//     config: {
//       versions: null,
//       overrides: null,
//       projectMetadata: {
//         roles: null,
//         billing: {
//           workorder: '',
//         },
//         serviceTags: null,
//       },
//     },
//     metadata: {
//       projectId: faker.string.uuid(),
//       project: {
//         id: faker.string.uuid(),
//         name: 'aaa-002-dev',
//         description: 'A project description',
//         active: true,
//         created: '2024-06-24T10:31:58.406Z',
//         updated: '2024-06-24T10:31:58.406Z',
//         projectMetadata: {
//           roles: [
//             {
//               contactInfo: {
//                 upn: 'john.doe@ror.com',
//                 email: 'john.doe@ror.com',
//                 phone: '73565395',
//               },
//               roleDefinition: 'Owner',
//             },
//             {
//               contactInfo: {
//                 upn: 'john.doe@ror.com',
//                 email: 'john.doe@ror.com',
//                 phone: '73565395',
//               },
//               roleDefinition: 'Responsible',
//             },
//           ],
//           billing: {
//             workorder: '410500600 ',
//           },
//           serviceTags: {},
//         },
//       },
//       criticality: 1,
//       sensitivity: 1,
//       description: '',
//       serviceTags: {},
//       billing: {
//         workorder: '410500600 ',
//       },
//       roles: [
//         {
//           contactInfo: {
//             upn: 'john.doe@ror.com',
//             email: 'john.doe@ror.com',
//             phone: '73565395',
//           },
//           roleDefinition: 'Owner',
//         },
//         {
//           contactInfo: {
//             upn: 'john.doe@ror.com',
//             email: 'john.doe@ror.com',
//             phone: '73565395',
//           },
//           roleDefinition: 'Responsible',
//         },
//       ],
//     },
//     status: {
//       state: '',
//       phase: '',
//       conditions: null,
//     },
//   },
// ]

/**
 * Mock data for KubernetesClusters v2.
 */

// TODO: Uncomment when needed

export const clustersVersion2 = {
  resources: Array.from({ length: 104 }).map((_, i) => ({
    apiVersion: 'general.ror.internal/v1alpha1',
    kind: 'KubernetesCluster',
    metadata: {
      name: `mock-cluster-${i + 1}`,
      resourceVersion: 'v2',
      creationTimestamp: '2022-03-17T14:06:47Z',
      labels: { [`mock label ${i + 1}`]: `label value ${i + 1}` },
      annotations: { [`mock annotation ${i + 1}`]: `annotation value ${i + 1}` },
      uid: faker.string.uuid(),
      namespace: 'mock-namespace',
      generation: 1,
      ownerReferences: [],
    },
    rormeta: {
      version: 'v2',
      ownerref: {
        scope: 'workspace',
        subject: `mock-workspace-${i + 1}`,
      },
      tags: [
        {
          key: 'environment',
          value: i % 2 === 0 ? 'production' : 'development',
          properties: { color: i % 2 === 0 ? '#FF5733' : '#00FF00' },
        },
        {
          key: 'team',
          value: 'platform',
          properties: { color: '#33C1FF' },
        },
      ],
    },
    kubernetescluster: {
      spec: {
        data: {
          clusterId: `mock-cluster-id-${i + 1}`,
          provider: 'tanzu',
          datacenter: `mock-dc-${(i % 5) + 1}`,
          region: 'trøndelag',
          zone: 'a',
          project: 'test',
          workspace: `mock-workspace-${i + 1}`,
          workorder: `wo${i + 1}`,
          environment: i % 2 === 0 ? 'dev' : 'prod',
        },
        topology: {
          version: 'v1.28.7',
          controlplane: {
            replicas: 3,
            version: 'v1.28.7',
            provider: 'tanzu',
            machineClass: 'best-effort-large',
            metadata: { labels: {}, annotations: {} },
            storage: [],
          },
          workers: {
            nodePools: [
              {
                name: 'default',
                replicas: 4,
                version: 'v1.28.7',
                provider: 'tanzu',
                machineClass: 'best-effort-cpu-2xlarge',
                autoscaling: {
                  enabled: false,
                  minReplicas: 0,
                  maxReplicas: 0,
                  scalingRules: [],
                },
                metadata: { labels: {}, annotations: {} },
              },
            ],
          },
        },
      },
      status: {
        state: {
          cluster: {
            externalId: `ext-mock-${i + 1}`,
            resources: {
              cpu: { capacity: '8', used: String(2 + i), percentage: Math.floor(((2 + i) / 8) * 100) },
              memory: { capacity: '64Gi', used: `${8 + i}Gi`, percentage: Math.floor(((8 + i) / 64) * 100) },
              gpu: null,
              disk: null,
            },
            price: { monthly: 10 + i, yearly: 120 + i * 10 },
            controlplane: {
              status: 'Running',
              message: '',
              scale: 3,
              machineClass: 'best-effort-large',
              resources: {
                cpu: { capacity: '10', used: String(2 + i), percentage: Math.floor(((2 + i) / 10) * 100) },
                memory: { capacity: '64Gi', used: `${8 + i}Gi`, percentage: Math.floor(((8 + i) / 64) * 100) },
                gpu: null,
                disk: null,
              },
              nodes: [],
            },
            nodepools: [
              {
                name: 'default',
                status: 'Running',
                message: '',
                scale: 4,
                machineClass: 'best-effort-cpu-2xlarge',
                autoscaling: {
                  enabled: false,
                  minReplicas: 0,
                  maxReplicas: 0,
                },
                resources: {
                  cpu: { capacity: '4', used: String(1 + i), percentage: Math.floor(((1 + i) / 4) * 100) },
                  memory: { capacity: '32Gi', used: `${4 + i}Gi`, percentage: Math.floor(((4 + i) / 32) * 100) },
                  gpu: null,
                  disk: null,
                },
                nodes: [`mock-node-${i + 1}-a`, `mock-node-${i + 1}-b`],
              },
            ],
          },
          versions: [{ name: 'kubernetes', version: 'v1.28.7', branch: 'stable' }],
          endpoints: [
            { name: 'argocd', address: `argo.mock-${i + 1}.local` },
            { name: 'grafana', address: `grafana.mock-${i + 1}.local` },
          ],
          egressIP: `192.168.1.${10 + i}`,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: `user${i + 1}`,
          created: '2022-03-17T14:06:47Z',
        },
        phase: 'Running',
        conditions: [
          {
            type: 'ready',
            status: i % 2 === 0 ? 'success' : 'error',
            lastTransitionTime: '2022-03-17T14:06:47Z',
            reason: i % 2 === 0 ? 'ClusterReady' : 'ClusterNotReady',
            message: i % 2 === 0 ? 'Cluster is ready.' : 'Cluster is not ready.',
          },
        ],
      },
    },
  })),
}

// export const clustersVersion2 = {
//   resources: [
//     {
//       apiVersion: 'general.ror.internal/v1alpha1',
//       kind: 'KubernetesCluster',
//       metadata: {
//         name: 'aaa-001-dev',
//         resourceVersion: 'v2',
//         creationTimestamp: '2022-03-17T14:06:47Z',
//         labels: null,
//         annotations: null,
//         uid: faker.string.uuid(),
//         namespace: null,
//         generation: null,
//         ownerReferences: [],
//       },
//       rormeta: {
//         version: 'v2',
//         ownerref: {
//           scope: 'workspace',
//           subject: 'trd1-nhn-mgmt',
//         },
//         tags: null,
//       },
//       kubernetescluster: {
//         spec: {
//           data: {
//             clusterId: '',
//             provider: 'tanzu',
//             datacenter: 'trd1',
//             region: 'trøndelag',
//             zone: '',
//             project: '',
//             workspace: 'trd1-avi-system',
//             workorder: '',
//             environment: '',
//           },
//           topology: {
//             version: '',
//             controlplane: {
//               replicas: 0,
//               version: '',
//               provider: '',
//               machineClass: '',
//               metadata: { labels: null, annotations: null },
//               storage: null,
//             },
//             workers: {
//               nodePools: [
//                 {
//                   machineClass: 'best-effort-medium',
//                   provider: 'tanzu',
//                   version: '',
//                   name: 'workers',
//                   replicas: 3,
//                   autoscaling: {
//                     enabled: false,
//                     minReplicas: 0,
//                     maxReplicas: 0,
//                     scalingRules: null,
//                   },
//                   metadata: { labels: null, annotations: null },
//                 },
//               ],
//             },
//           },
//         },
//         status: {
//           state: {
//             cluster: {
//               externalId: '',
//               resources: {},
//               price: { monthly: 0, yearly: 0 },
//               controlplane: {
//                 status: '',
//                 message: '',
//                 scale: 0,
//                 machineClass: '',
//                 resources: {},
//               },
//               nodepools: null,
//             },
//             versions: null,
//             endpoints: null,
//             egressIP: '',
//             lastUpdated: null,
//             lastUpdatedBy: '',
//             created: null,
//           },
//           phase: '',
//           conditions: null,
//         },
//       },
//     },
//     {
//       apiVersion: 'general.ror.internal/v1alpha1',
//       kind: 'KubernetesCluster',
//       metadata: {
//         name: 'bbb-002-prod',
//         resourceVersion: 'v2',
//         creationTimestamp: '2022-06-11T09:32:20Z',
//         labels: null,
//         annotations: null,
//         uid: faker.string.uuid(),
//         namespace: null,
//         generation: null,
//         ownerReferences: [],
//       },
//       rormeta: {
//         version: 'v2',
//         ownerref: {
//           scope: 'workspace',
//           subject: 'prod-nhn-mgmt',
//         },
//         tags: [],
//       },
//       kubernetescluster: {
//         spec: {
//           data: {
//             clusterId: '',
//             provider: 'tanzu',
//             datacenter: 'trd1',
//             region: 'trøndelag',
//             zone: '',
//             project: '',
//             workspace: 'trd1-app',
//             workorder: '',
//             environment: '',
//           },
//           topology: {
//             version: '',
//             controlplane: {
//               replicas: 0,
//               version: '',
//               provider: '',
//               machineClass: '',
//               metadata: { labels: null, annotations: null },
//               storage: null,
//             },
//             workers: {
//               nodePools: [
//                 {
//                   machineClass: 'best-effort-xlarge',
//                   provider: 'tanzu',
//                   version: '',
//                   name: 'workers',
//                   replicas: 5,
//                   autoscaling: {
//                     enabled: false,
//                     minReplicas: 0,
//                     maxReplicas: 0,
//                     scalingRules: null,
//                   },
//                   metadata: { labels: null, annotations: null },
//                 },
//               ],
//             },
//           },
//         },
//         status: {
//           state: {
//             cluster: {
//               externalId: '',
//               resources: {},
//               price: { monthly: 0, yearly: 0 },
//               controlplane: {
//                 status: '',
//                 message: '',
//                 scale: 0,
//                 machineClass: '',
//                 resources: {},
//               },
//               nodepools: null,
//             },
//             versions: null,
//             endpoints: null,
//             egressIP: '',
//             lastUpdated: null,
//             lastUpdatedBy: '',
//             created: null,
//           },
//           phase: '',
//           conditions: null,
//         },
//       },
//     },
//   ],
// }
