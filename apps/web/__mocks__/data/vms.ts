export const mockVms = {
  resources: Array.from({ length: 104 }, (_, i) => {
    const idx = i + 1
    return {
      _id: {
        $oid: `mockid${idx}`,
      },
      uid: `e54e6ece-94de-5fe3-8479-b94738d3ec5${idx}`,
      metadata: {
        name: `avi01_w01_default-se-klplf-${idx}`,
        generatename: '',
        namespace: '',
        selflink: '',
        uid: `e54e6ece-94de-5fe3-8479-b94738d3ec5${idx}`,
        resourceversion: '',
        generation: 0,
        creationtimestamp: {
          time: {
            $date: {
              $numberLong: '-62135596800000',
            },
          },
        },
        deletiontimestamp: null,
        deletiongraceperiodseconds: null,
        labels: null,
        annotations: null,
        ownerreferences: null,
        finalizers: null,
        managedfields: null,
      },
      rormeta: {
        version: '',
        lastreported: '',
        internal: false,
        hash: '',
        ownerref: {
          scope: 'virtualmachine',
          subject: `501425ca-4dd7-1950-f259-3e53d087a3${idx}`,
        },
        action: 'Add',
        tags: null,
      },
      typemeta: {
        kind: 'VirtualMachine',
        apiversion: 'general.ror.internal/v1alpha1',
      },
      virtualmachine: {
        externalid: `501425ca-4dd7-1950-f259-3e53d087a3${idx}`,
        spec: {
          cpu: {
            sockets: 2,
            corespersocket: 1,
          },
          name: `avi01_w01_default-se-klplf-${idx}`,
          disks: null,
          memory: {
            sizebytes: 4294967296,
          },
        },
        status: {
          lastupdated: {
            time: {
              $date: '2025-09-23T07:52:41Z',
            },
          },
          location: 'OSL3 NAM02',
          cpu: {
            unit: '',
            usage: 0,
            resourcevirtualmachinecpuspec: {
              sockets: 2,
              corespersocket: 1,
            },
          },
          tags: {},
          state: {
            state: 'ready',
            reason: '',
            time: '',
          },
          disks: [
            {
              usagebytes: 22326648832,
              ismounted: true,
              resourcevirtualmachinediskspec: {
                id: '6000C29d-09cf-6b8f-c444-8be2c1213232',
                name: '[tos3-w01-cl01-ds-vsan01] a2a9be68-f282-bbc5-307d-78ac446cd540/avi01_w01_default-se-klplf.vmdk',
                type: 'persistent',
                sizebytes: 26843545600,
              },
            },
          ],
          memory: {
            unit: '',
            usage: 0,
            resourcevirtualmachinememoryspec: {
              sizebytes: 4294967296,
            },
          },
          networks: [
            {
              id: 'seg-domain-osl3-w01-07391f30-5c7d-81db-a8fc-1759c014d22c-avi-01-mgmt',
              dns: '',
              ipv4: '10.28.212.163',
              ipv6: 'fe80::250:56ff:fe94:9a78',
              mask: '',
              gateway: '',
              mac: '00:50:56:94:9a:78',
            },
            {
              id: 'seg-domain-osl3-w01-07391f30-5c7d-81db-a8fc-1759c014d22c-avi-01-nhn-lab',
              dns: '',
              ipv4: '10.28.212.132',
              ipv6: 'fe80::250:56ff:fe94:f6f',
              mask: '',
              gateway: '',
              mac: '00:50:56:94:0f:6f',
            },
          ],
          operatingsystem: {
            id: `mock${idx}`,
            name: `Mock VM ${idx}`,
            family: 'Linux',
            version: '5.4.0-208-generic',
            hostname: `avi01-w01-default-se-klplf-${idx}`,
            powerstate: idx % 3 === 0 ? 'poweredOn' : idx % 3 === 1 ? 'poweredOff' : 'undefined',
            toolversion: '11360',
            architecture: 'X86',
          },
        },
        provider: 'Vsphere',
      },
    }
  }),
}
