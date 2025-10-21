import { z } from 'zod'
import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'

export const VirtualMachineOperatingSystem = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  family: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  hostname: z.string().nullable().optional(),
  powerstate: z.string().nullable().optional(),
  toolversion: z.string().nullable().optional(),
  architecture: z.string().nullable().optional(),
})

export const VMSpecMetadataDetails = z.object({
  name: z.string().nullable().optional(),
  generatename: z.string().nullable().optional(),
  namespace: z.string().nullable().optional(),
  selflink: z.string().nullable().optional(),
  uid: z.string().nullable().optional(),
  resourceversion: z.string().nullable().optional(),
  generation: z.number().nullable().optional(),
  creationstamp: z
    .object({
      time: z.object({
        $date: z.object({
          $numberLong: z.string(),
        }),
      }),
    })
    .nullable()
    .optional(),
  deletiontimestamp: z.string().nullable().optional(),
  deletiongraceperiodseconds: z.string().nullable().optional(),
  labels: z.record(z.string(), z.string()).nullable().optional(),
  annotations: z.record(z.string(), z.string()).nullable().optional(),
  ownerreferences: z.string().nullable().optional(),
  finalizers: z.array(z.string()).nullable().optional(),
  managedfields: z.string().nullable().optional(),
})

export const VMRorMetaData = z.object({
  version: z.string().nullable().optional(),
  lastreported: z.string().nullable().optional(),
  internal: z.boolean().nullable().optional(),
  hash: z.string().nullable().optional(),
  ownerref: z
    .object({
      scope: z.string().nullable().optional(),
      subject: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  action: z.string().nullable().optional(),
  tags: z.record(z.string(), z.string()).nullable().optional(),
})

export const VMTypemetaData = z.object({
  kind: z.string().nullable().optional(),
  apiversion: z.string().nullable().optional(),
})

export const VirtualMachineSpec = z.object({
  spec: z
    .object({
      cpu: z
        .object({
          sockets: z.number().nullable().optional(),
          corespersocket: z.number().nullable().optional(),
        })
        .nullable()
        .optional(),
      name: z.string().nullable().optional(),
      disks: z.record(z.string(), z.string()).nullable().optional(),
      memory: z
        .object({
          sizebytes: z.number().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
})

export const VirtualMachineLastUpdate = z.object({
  lastupdated: z
    .object({
      time: z.object({
        $date: z.object({
          $numberLong: z.string(),
        }),
      }),
    })
    .nullable()
    .optional(),
})

export const VirtualMachineCpu = z.object({
  cpu: z
    .object({
      unit: z.string().nullable().optional(),
      usage: z.number().nullable().optional(),
      resourcevirtualmachinecpuspec: z
        .object({
          sockets: z.number().nullable().optional(),
          corespersocket: z.number().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
})

export const VirtualMachineState = z.object({
  state: z
    .object({
      state: z.string().nullable().optional(),
      reason: z.string().nullable().optional(),
      time: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

export const VirtualMachineDisks = z.object({
  disks: z
    .array(
      z.object({
        usagebytes: z.number().nullable().optional(),
        ismounted: z.boolean().nullable().optional(),
        resourcevirtualmachinediskspec: z
          .object({
            id: z.string().nullable().optional(),
            name: z.string().nullable().optional(),
            type: z.string().nullable().optional(),
            sizebytes: z.number().nullable().optional(),
          })
          .nullable()
          .optional(),
      })
    )
    .nullable()
    .optional(),
})

export const VirtualMachineMemory = z.object({
  memory: z
    .object({
      unit: z.string().nullable().optional(),
      usage: z.number().nullable().optional(),
      resourcevirtualmachinememoryspec: z
        .object({
          sizebytes: z.number().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
})

export const VirtualMachineNetworks = z.object({
  networks: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        dns: z.string().nullable().optional(),
        ipv4: z.string().nullable().optional(),
        ipv6: z.string().nullable().optional(),
        mask: z.string().nullable().optional(),
        gateway: z.string().nullable().optional(),
        mac: z.string().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
})

export const VirtualMachineStatus = z.object({
  lastupdated: VirtualMachineLastUpdate.nullable().optional(),
  location: z.string().nullable().optional(),
  cpu: VirtualMachineCpu.nullable().optional(),
  tags: z.record(z.string(), z.string()).nullable().optional(),
  state: VirtualMachineState.nullable().optional(),
  disks: VirtualMachineDisks.nullable().optional(),
  memory: VirtualMachineMemory.nullable().optional(),
  networks: VirtualMachineNetworks.nullable().optional(),
  operatingsystem: VirtualMachineOperatingSystem.nullable().optional(),
})

export const VMVirtualMachine = z.object({
  externalid: z.string().nullable().optional(),
  spec: VirtualMachineSpec.nullable().optional(),
  status: VirtualMachineStatus.nullable().optional(),
  provider: z.string().nullable().optional(),
})

export const VirtualMachineSpecData = z.object({
  _id: z
    .object({
      $oid: z.string(),
    })
    .nullable()
    .optional(),
  uid: z.string().nullable().optional(),
  metadata: VMSpecMetadataDetails.nullable().optional(),
  rormeta: VMRorMetaData.nullable().optional(),
  typemeta: VMTypemetaData.nullable().optional(),
  virtualmachine: VMVirtualMachine.nullable().optional(),
})

export const VMSchema = V2ResourceSchema.extend({
  virtualmachine: VirtualMachineSpecData.nullable().optional(),
})

export const VMResourceResponseSchema = createV2ResourceResponseSchema(VMSchema)
