/*
 * FILE OVERVIEW
 *
 * This file provides mock data for datacenters, simulating a response from the ROR API.
 */

import { faker } from '@faker-js/faker'
import { DatacenterResponse } from '@ror/js-api-client'

/**
 * Mock data for datacenters (5 datacenters total).
 */
export const datacenters: DatacenterResponse = {
  resources: [
    {
      kind: 'Datacenter',
      apiVersion: 'v1',
      metadata: {
        name: 'trd1',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-15T12:00:00Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'organization', subject: 'ror' },
        action: 'Update',
      },
      datacenter: {
        spec: {
          workspaces: [],
        },
        status: {
          workspaces: [],
          location: {
            id: 'loc-trd',
            region: 'Trøndelag',
            country: 'Norway',
          },
          apiEndpoint: 'https://trd1.tanzu.example.com',
        },
        legacy: {
          id: faker.string.uuid(),
          name: 'trd1',
          provider: 'tanzu',
          location: {
            id: 'loc-trd',
            region: 'Trøndelag',
            country: 'Norway',
          },
          apiEndpoint: 'https://trd1.tanzu.example.com',
        },
      },
    },
    {
      kind: 'Datacenter',
      apiVersion: 'v1',
      metadata: {
        name: 'osl1',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-15T12:00:00Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'organization', subject: 'ror' },
        action: 'Update',
      },
      datacenter: {
        spec: { workspaces: [] },
        status: {
          workspaces: [],
          location: {
            id: 'loc-osl',
            region: 'Oslo',
            country: 'Norway',
          },
          apiEndpoint: 'https://osl1.tanzu.example.com',
        },
        legacy: {
          id: faker.string.uuid(),
          name: 'osl1',
          provider: 'tanzu',
          location: {
            id: 'loc-osl',
            region: 'Oslo',
            country: 'Norway',
          },
          apiEndpoint: 'https://osl1.tanzu.example.com',
        },
      },
    },
    {
      kind: 'Datacenter',
      apiVersion: 'v1',
      metadata: {
        name: 'trd1cl02',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-15T12:00:00Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'organization', subject: 'ror' },
        action: 'Update',
      },
      datacenter: {
        spec: { workspaces: [] },
        status: {
          workspaces: [],
          location: {
            id: 'loc-trd2',
            region: 'Trøndelag',
            country: 'Norway',
          },
          apiEndpoint: 'https://trd1cl02.tanzu.example.com',
        },
        legacy: {
          id: faker.string.uuid(),
          name: 'trd1cl02',
          provider: 'tanzu',
          location: {
            id: 'loc-trd2',
            region: 'Trøndelag',
            country: 'Norway',
          },
          apiEndpoint: 'https://trd1cl02.tanzu.example.com',
        },
      },
    },
    {
      kind: 'Datacenter',
      apiVersion: 'v1',
      metadata: {
        name: 'norwayeast',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-15T12:00:00Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'organization', subject: 'ror' },
        action: 'Update',
      },
      datacenter: {
        spec: { workspaces: [] },
        status: {
          workspaces: [],
          location: {
            id: 'loc-ne',
            region: 'Norway East',
            country: 'Norway',
          },
          apiEndpoint: 'https://norwayeast.aks.example.com',
        },
        legacy: {
          id: faker.string.uuid(),
          name: 'norwayeast',
          provider: 'aks',
          location: {
            id: 'loc-ne',
            region: 'Norway East',
            country: 'Norway',
          },
          apiEndpoint: 'https://norwayeast.aks.example.com',
        },
      },
    },
    {
      kind: 'Datacenter',
      apiVersion: 'v1',
      metadata: {
        name: 'trd1',
        uid: faker.string.uuid(),
        resourceVersion: faker.string.numeric(6),
        creationTimestamp: '2025-01-15T12:00:00Z',
        labels: {},
        annotations: {},
        managedFields: [],
      },
      rormeta: {
        version: 'v2',
        hash: faker.string.numeric(10),
        ownerref: { scope: 'organization', subject: 'ror' },
        action: 'Update',
      },
      datacenter: {
        spec: { workspaces: [] },
        status: {
          workspaces: [],
          location: {
            id: 'loc-trd3',
            region: 'Trøndelag',
            country: 'Norway',
          },
          apiEndpoint: 'https://trd1.talos.example.com',
        },
        legacy: {
          id: faker.string.uuid(),
          name: 'trd1',
          provider: 'talos',
          location: {
            id: 'loc-trd3',
            region: 'Trøndelag',
            country: 'Norway',
          },
          apiEndpoint: 'https://trd1.talos.example.com',
        },
      },
    },
  ],
}

export default datacenters
