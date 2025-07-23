import { faker } from '@faker-js/faker'
import { NodeResponse } from '@ror/js-api-client'

/**
 * Mock data for nodes (4 nodes).
 */
const nodes: NodeResponse = {
  resources: [
    {
      kind: 'Node',
      apiVersion: 'v1',
      metadata: {
        name: 't-aaa-001-control-plane-6ffkc',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-31T15:00:54Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'cluster', subject: 'aaa-001-dev' },
        action: 'Update',
      },
      node: {
        spec: {},
        status: {
          addresses: null,
          capacity: {
            cpu: '',
            ephemeralStorage: '',
            memory: '',
            pods: '',
          },
          conditions: null,
          nodeInfo: {
            architecture: 'amd64',
            bootID: '',
            containerRuntimeVersion: '',
            kernelVersion: '',
            kubeProxyVersion: '',
            kubeletVersion: '',
            machineID: '',
            operatingSystem: '',
            osImage: 'VMware Photon OS/Linux',
            systemUUID: '',
          },
        },
      },
    },
    {
      kind: 'Node',
      apiVersion: 'v1',
      metadata: {
        name: 't-aaa-001-workers-f4jpw-f4hxf-h5g2n',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-31T15:14:58Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'cluster', subject: 'aaa-001-dev' },
        action: 'Update',
      },
      node: {
        spec: {},
        status: {
          addresses: null,
          capacity: {
            cpu: '',
            ephemeralStorage: '',
            memory: '',
            pods: '',
          },
          conditions: null,
          nodeInfo: {
            architecture: 'amd64',
            bootID: '',
            containerRuntimeVersion: '',
            kernelVersion: '',
            kubeProxyVersion: '',
            kubeletVersion: '',
            machineID: '',
            operatingSystem: '',
            osImage: 'VMware Photon OS/Linux',
            systemUUID: '',
          },
        },
      },
    },
    {
      kind: 'Node',
      apiVersion: 'v1',
      metadata: {
        name: 't-aaa-001-workers-f4jpw-f4hxf-lmcrl',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-31T15:10:22Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(19),
        ownerref: { scope: 'cluster', subject: 'aaa-001-dev' },
        action: 'Update',
      },
      node: {
        spec: {},
        status: {
          addresses: null,
          capacity: {
            cpu: '',
            ephemeralStorage: '',
            memory: '',
            pods: '',
          },
          conditions: null,
          nodeInfo: {
            architecture: 'amd64',
            bootID: '',
            containerRuntimeVersion: '',
            kernelVersion: '',
            kubeProxyVersion: '',
            kubeletVersion: '',
            machineID: '',
            operatingSystem: '',
            osImage: 'VMware Photon OS/Linux',
            systemUUID: '',
          },
        },
      },
    },
    {
      kind: 'Node',
      apiVersion: 'v1',
      metadata: {
        name: 't-aaa-001-workers-f4jpw-f4hxf-w2mhs',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-31T15:06:54Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(19),
        ownerref: { scope: 'cluster', subject: 'aaa-001-dev' },
        action: 'Update',
      },
      node: {
        spec: {},
        status: {
          addresses: null,
          capacity: {
            cpu: '',
            ephemeralStorage: '',
            memory: '',
            pods: '',
          },
          conditions: null,
          nodeInfo: {
            architecture: 'amd64',
            bootID: '',
            containerRuntimeVersion: '',
            kernelVersion: '',
            kubeProxyVersion: '',
            kubeletVersion: '',
            machineID: '',
            operatingSystem: '',
            osImage: 'VMware Photon OS/Linux',
            systemUUID: '',
          },
        },
      },
    },
  ],
}

export default nodes
