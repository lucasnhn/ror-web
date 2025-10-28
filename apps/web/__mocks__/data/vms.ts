export const mockVms = {
  resources: Array.from({ length: 104 }, (_, i) => {
    const idx = i + 1
    return {
      kind: 'VirtualMachine',
      apiVersion: 'general.ror.internal/v1alpha1',
      metadata: {
        name: `P-ARK-FIL.Mock-${idx}`,
        uid: `mock-uid-${idx}`,
      },
      rormeta: {
        ownerref: {
          scope: 'virtualmachine',
          subject: `mock-subject-${idx}`,
        },
        action: 'Add',
      },
      virtualmachine: {
        externalId: `501425ca-4dd7-1950-f259-3e53d087a3${idx}`,
        provider: 'Vsphere',
        spec: {
          cpu: {
            coresPerSocket: 1,
            sockets: 2,
          },
          name: `mock-vm-${idx}`,
          disks: [
            {
              id: `disk-${idx}`,
              name: `disk-${idx}-vmdk`,
              sizeBytes: 26843545600,
              type: 'persistent',
            },
          ],
          memory: {
            sizeBytes: 4294967296,
          },
        },
        status: {
          lastUpdated: '2025-09-23T07:52:41Z',
          location: 'OSL3 NAM02',
          cpu: {
            coresPerSocket: 1,
            sockets: 2,
            unit: 'vCPU',
            usage: 0,
          },
          disks: [
            {
              id: `disk-${idx}`,
              isMounted: true,
              name: `disk-${idx}-vmdk`,
              sizeBytes: 26843545600,
              type: 'persistent',
              usageBytes: 22326648832,
            },
          ],
          memory: {
            sizeBytes: 4294967296,
            unit: 'bytes',
            usage: 0,
          },
          networks: [
            {
              id: `net-${idx}-mgmt`,
              dns: '10.28.212.1',
              gateway: '',
              ipv4: `10.28.212.${100 + idx}`,
              ipv6: `fe80::250:56ff:fe94:9a${idx.toString().padStart(2, '0')}`,
              mac: `00:50:56:94:9a:${(78 + idx).toString(16).padStart(2, '0')}`,
              mask: '',
            },
          ],
          operatingSystem: {
            id: `mock${idx}`,
            name: `Mock VM ${idx}`,
            family: 'Linux',
            version: '5.4.0-208-generic',
            hostName: `mock-vm-${idx}`,
            powerState: idx % 3 === 0 ? 'poweredOn' : idx % 3 === 1 ? 'poweredOff' : 'undefined',
            toolVersion: '11360',
            architecture: 'X86',
          },
          state: {
            reason: '',
            state: 'ready',
            time: '',
          },
          tags: {
            team: {
              description: 'Tag 1',
              key: 'team',
              value: 'devops',
            },
            _AdGroup: {
              description: 'Tag 2',
              key: 'environment',
              value: idx % 2 === 0 ? 'prod' : 'test',
            },
          },
        },
      },
    }
  }),
}
