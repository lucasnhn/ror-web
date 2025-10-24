import { User } from 'next-auth'
import { VMCardData } from '@/features/vms/types/vm-card-type'
import { Params } from '@/types/resources-page'

export interface VirtualMachine {
  id?: {
    $olid?: string
  }
  uid: string
  metadata?: {
    name?: string
    generatename?: string
    namespace?: string
    selflink?: string
    uid?: string
    resourceversion?: string
    creationtimestamp?: {
      time: {
        $date: {
          $numberLong?: string
        }
      }
    }
    deletiontimestamp?: string | null
    labels?: string | null
    annotations?: string | null
    ownerreferences?: string | null
    finalizers?: string[] | null
    managedfields?: string | null
  }
  rormeta?: {
    version?: string
    lastreported?: string
    internal?: boolean
    hash?: string
    ownerref?: {
      scope?: string
      subject?: string
    }
    action?: string
    tags?: string[] | null
  }
  typemeta?: {
    kind?: string
    apiversion?: string
  }
  virtualmachine?: {
    externalid?: string | null
    spec?: {
      cpu?: {
        sockets?: number
        corespersocket?: number
      }
      name?: string
      disks?: string | null
      memory?: {
        sizebytes?: number
      }
    }
    status?: {
      lastupdated?: {
        time?: {
          date?: { date: string }
        }
      }
      location?: string | null
      cpu?: {
        units?: number | null
        usage?: number
        resourcevirtualmachinecpuspec?: {
          sockets?: number
          corespersocket?: number
        }
      }
      tags?: Record<string, string> | null
      state?: {
        state?: string | null
        reason?: string
        time?: string | undefined
      }
      disks?: {
        usagebytes?: number
        ismounted?: boolean
        resourcevirtualmachinediskspec?: {
          id?: string
          name?: string
          type?: string
          sizebytes?: number
        }
      }[]
      memory?: {
        unit?: string
        usage?: number
        resourcevirtualmachinememoryspec?: {
          sizebytes?: number
        }
      }
      networks?: {
        id?: string
        dns?: string
        ipv4?: string
        ipv6?: string
        mask?: string
        gateway?: string
        mac?: string
      }[]
      operatingsystem?: {
        id?: string | null
        name?: string | null
        family?: string | null
        version?: string | null
        hostname?: string | null
        powerstate?: string | null
        toolversion?: string | null
        architecture?: string | null
      }
    }
    provider?: string | null
  }
}

export interface VmResponse {
  resources: VirtualMachine[]
}

export interface VMCardProps {
  className?: string
  user?: User
  vm: VirtualMachine
  vmDisplayData: VMCardData[]
}

export interface VMTableProps {
  metadata_name?: string
  os_id?: string | null
  powerstate?: string | null
}

export interface PageViewProps {
  className?: string
  user: User
  vms: VirtualMachine[]
  params: Params
}

export interface Network {
  id: string
  ipv4?: string
  ipv6?: string
  mac?: string
  dns?: string
}

export interface VMDetailsProps {
  user?: User
  className?: string
}

export interface VmSearchProps {
  items: VirtualMachine[]
  onSelect?: (item: VirtualMachine) => void
  onResultsChange?: (results: VirtualMachine[]) => void
}

export interface UseVmLayoutParams {
  params: Promise<{ id: string }>
}

export interface UseVmLayoutReturn {
  id: string
  vm: VirtualMachine | null
  isLoading: boolean
  error: string | null
}
