import { faker } from '@faker-js/faker'

/**
 * Mock data for Ingresses.
 * This data structure is used to represent Kubernetes Ingress resources.
 */
export const ingressesResponse = {
  resources: [
    {
      kind: 'Ingress',
      apiVersion: 'networking.k8s.io/v1',
      metadata: {
        name: 'argocd-server',
        namespace: 'argocd',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(9),
        generation: 1,
        creationTimestamp: faker.date.past(),
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(19),
        ownerref: {
          scope: 'cluster',
          subject: 'aaa-002-dev-9oz9',
        },
        action: 'Add',
      },
      ingress: {
        spec: {
          defaultBackend: {
            resource: {},
            service: {
              port: {},
            },
          },
          ingressClassName: 'avi-ingress-class-datacenter',
          rules: [
            {
              apiGroup: '',
              http: {
                paths: [
                  {
                    backend: {
                      resource: {},
                      service: {
                        name: 'argo-web',
                        port: {
                          number: 80,
                        },
                      },
                    },
                    path: '/',
                    pathType: 'Prefix',
                  },
                ],
              },
            },
          ],
          tls: [
            {
              hosts: ['argo.aaa-002-dev.no-e.sky.example.com'],
              secretName: 'argo-tls-test',
            },
          ],
        },
        status: {
          loadBalancer: {
            ingress: [
              {
                hostname: 'argo.aaa-002-dev.no-e.sky.example.com',
                ip: faker.internet.ipv4(),
              },
            ],
          },
        },
      },
    },
  ],
}
