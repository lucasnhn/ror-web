export const mockBackupRuns = {
  resources: [
    {
      kind: 'BackupRun',
      apiVersion: 'backup.ror.internal/v1alpha1',
      metadata: {
        name: '11158793:1762777612377235',
        uid: 'a2f91dfd-0659-5428-b4c2-bec93ecdd7b9',
      },
      rormeta: {
        ownerref: {
          scope: 'ror',
          subject: 'globalscope',
        },
        action: 'Add',
      },
      backuprun: {
        id: '11158793:1762777612377235',
        provider: 'cohesity',
        source: 'mtr1-bck-ccl01.drift.nhn.no',
        status: {
          id: '11158793:1762777612377235',
          backupJobId: '4923908281402464:1614676439887:11158793',
          backupTargets: [
            {
              name: 'LTRD-WD-ANS01.365lab.no-mock-1',
              id: '2606',
              externalId: '501425ca-4dd7-1950-f259-3e53d087a31',
              source: {
                name: '',
                id: '',
                uuid: '',
                type: '',
              },
              size: {
                unit: 'bytes',
                sourceSize: 562930434,
                logicalSize: 367211315200,
                physicalSize: 2140667904,
              },
            },
            {
              name: 'LTRD-WD-ANS01.365lab.no-mock-5',
              id: '2515',
              externalId: '501425ca-4dd7-1950-f259-3e53d087a35',
              source: {
                name: '',
                id: '',
                uuid: '',
                type: '',
              },
              size: {
                unit: 'bytes',
                sourceSize: 437901770,
                logicalSize: 2138885324800,
                physicalSize: 5331877888,
              },
            },
          ],
          backupDestinations: [
            {
              name: 'mtr1-bck-ccl01.drift.nhn.no',
              id: '',
              type: 'local',
              status: 'Succeeded',
            },
            {
              name: 'mtr2-bck-ccl01',
              id: '818669404044608',
              type: 'remote',
              status: 'Succeeded',
            },
          ],
          startTime: '2025-08-29T23:26:52Z',
          endTime: '2025-08-29T23:30:09Z',
          expiryTime: '2025-09-28T23:30:33Z',
          backupStorage: {
            unit: 'bytes',
            sourceSize: 7472545792,
            logicalSize: 2506096640000,
            physicalSize: 1000832204,
          },
        },
        spec: {
          delete: false,
        },
      },
    },
    {
      kind: 'BackupRun',
      apiVersion: 'backup.ror.internal/v1alpha1',
      metadata: {
        name: '11158793:1762748804990047',
        uid: 'a2f91dfd-0659-5428-b4c2-bec93ecdd7c0',
      },
      rormeta: {
        ownerref: {
          scope: 'ror',
          subject: 'globalscope',
        },
        action: 'Add',
      },
      backuprun: {
        id: '11158793:1762748804990047',
        provider: 'cohesity',
        source: 'mtr1-bck-ccl01.drift.nhn.no',
        status: {
          id: '11158793:1762748804990047',
          backupJobId: '4923908281402464:1614676439887:11158794',
          backupTargets: [
            {
              name: 'LTRD-WD-ANS01.365lab.no-mock-9',
              id: '2516',
              externalId: '501425ca-4dd7-1950-f259-3e53d087a310',
              source: {
                name: '',
                id: '',
                uuid: '',
                type: '',
              },
              size: {
                unit: 'bytes',
                sourceSize: 362930434,
                logicalSize: 267211315200,
                physicalSize: 1140667904,
              },
            },
          ],
          backupDestinations: [
            {
              name: 'mtr1-bck-ccl01.drift.nhn.no',
              id: '',
              type: 'local',
              status: 'Succeeded',
            },
          ],
          startTime: '2025-08-30T02:00:00Z',
          endTime: '2025-08-30T02:15:30Z',
          expiryTime: '2025-09-06T02:15:30Z',
          backupStorage: {
            unit: 'bytes',
            sourceSize: 362930434,
            logicalSize: 267211315200,
            physicalSize: 1140667904,
          },
        },
        spec: {
          delete: false,
        },
      },
    },
    {
      kind: 'BackupRun',
      apiVersion: 'backup.ror.internal/v1alpha1',
      metadata: {
        name: '11158794:1762777612377236',
        uid: 'a2f91dfd-0659-5428-b4c2-bec93ecdd7c1',
      },
      rormeta: {
        ownerref: {
          scope: 'ror',
          subject: 'globalscope',
        },
        action: 'Add',
      },
      backuprun: {
        id: '11158794:1762777612377236',
        provider: 'cohesity',
        source: 'mtr1-bck-ccl01.drift.nhn.no',
        status: {
          id: '11158794:1762777612377236',
          backupJobId: '4923908281402464:1614676439887:11158795',
          backupTargets: [
            {
              name: 'LTRD-WD-ANS01.365lab.no-mock-20',
              id: '2520',
              externalId: '501425ca-4dd7-1950-f259-3e53d087a320',
              source: {
                name: '',
                id: '',
                uuid: '',
                type: '',
              },
              size: {
                unit: 'bytes',
                sourceSize: 162930434,
                logicalSize: 167211315200,
                physicalSize: 840667904,
              },
            },
          ],
          backupDestinations: [
            {
              name: 'mtr1-bck-ccl01.drift.nhn.no',
              id: '',
              type: 'local',
              status: 'Failed',
            },
          ],
          startTime: '2025-08-30T02:00:00Z',
          endTime: null,
          expiryTime: null,
          backupStorage: {
            unit: 'bytes',
            sourceSize: 162930434,
            logicalSize: 167211315200,
            physicalSize: 840667904,
          },
        },
        spec: {
          delete: false,
        },
      },
    },
  ],
}
