export const mockVms = {
  resources: Array.from({ length: 104 }, (_, i) => {
    const idx = i + 1
    const teams = ['Windows Driftsplatform', 'Linux driftsplattform']
    return {
      kind: 'VirtualMachine',
      apiVersion: 'general.ror.internal/v1alpha1',
      metadata: {
        name: `LTRD-WD-ANS01.365lab.no-mock${idx}`,
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
          name: `LTRD-WD-ANS01.365lab.no-mock${idx}`,
          disks: null,
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
              name: `disk-${idx}-vmdk`,
              sizeBytes: 26843545600,
              type: 'persistent',
              usageBytes: 2684354560,
              isMounted: true,
            },
            {
              id: `disk-${idx + 1}`,
              name: `disk-${idx + 1}-vmdk`,
              sizeBytes: 35843545600,
              type: 'persistent',
              usageBytes: 1684354560,
              isMounted: false,
            },
            {
              id: `disk-${idx + 2}`,
              name: `disk-${idx + 2}-vmdk`,
              sizeBytes: 54843545600,
              type: 'persistent',
              usageBytes: 684354560,
              isMounted: true,
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
            {
              id: `2301_trd1-dc-nam-01-intern_365lab-01`,
              dns: '10.204.39.205',
              gateway: '',
              ipv4: `10.204.39.205.${101 + idx}`,
              ipv6: `fe80::250:56ff:fe94:9a${(idx + 1).toString().padStart(2, '0')}`,
              mac: `00:50:56:94:9a:${(79 + idx).toString(16).padStart(2, '0')}`,
              mask: '',
            },
          ],
          operatingSystem: {
            id: `mock${idx}`,
            name: `Red Hat Enterprise Linux`,
            family: 'Linux',
            version: '5.4.0-208-generic',
            hostName: `LTRD-WD-ANS01.365lab.no-mock${idx}`,
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
              description: teams[idx % 2],
              key: 'team',
              value: 'devops',
            },
            _AdGroup: {
              description: '',
              key: '_AdGroup',
              value: 'A-T1-ROR-VM-WD-Admin@drift.nhn.no',
            },
            environment: {
              description: 'Tag 2',
              key: 'environment',
              value: idx % 2 === 0 ? 'prod' : 'test',
            },
            serviceId: {
              description: 'Egg- og Sæddonorregisteret',
              key: 'service-id',
              value: `100${idx}`,
            },
            serviceSensitivity: {
              description: 'Intern',
              key: 'service-sensitivity',
              value: '2',
            },
          },
        },
      },
    }
  }),
}
