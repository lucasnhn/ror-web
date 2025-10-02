/*
 * FILE OVERVIEW
 *
 * This file defines the column configuration for displaying node information in a table.
 * Each column specifies a header label and an accessor function to extract the corresponding value from a `Node` object.
 * The columns include details such as Name, CPU, Memory, Operating System, and various version information.
 */

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Node } from '@ror/js-api-client'
import {
  getNodeArchitecture,
  getNodeBootID,
  getNodeContainerRuntimeVersion,
  getNodeCpu,
  getNodeEphemeralStorage,
  getNodeKernelVersion,
  getNodeKubeletVersion,
  getNodeMachineID,
  getNodeMemory,
  getNodeName,
  getNodeOperatingSystem,
  getNodeOsImage,
  getNodePods,
  getNodeSystemUUID,
} from '../utils/node'

/**
 * Defines the column configuration for displaying node information in a table.
 * Each column specifies a header label and an accessor function to extract the corresponding value from a `Node` object.
 */
export const nodeColumns: ColumnDef<Node>[] = [
  {
    header: 'Name',
    accessorFn: getNodeName,
  },
  {
    header: 'CPU',
    accessorFn: getNodeCpu,
  },
  {
    header: 'Memory',
    accessorFn: getNodeMemory,
  },
  {
    header: 'Ephemeral storage',
    accessorFn: getNodeEphemeralStorage,
  },
  {
    header: 'Pods',
    accessorFn: getNodePods,
  },
  {
    header: 'Operating system',
    accessorFn: getNodeOperatingSystem,
  },
  {
    header: 'OS Image',
    accessorFn: getNodeOsImage,
  },
  {
    header: 'Architecture',
    accessorFn: getNodeArchitecture,
  },
  {
    header: 'Boot ID',
    accessorFn: getNodeBootID,
  },
  {
    header: 'Container runtime version',
    accessorFn: getNodeContainerRuntimeVersion,
  },
  {
    header: 'Kernel version',
    accessorFn: getNodeKernelVersion,
  },
  {
    header: 'Kubelet version',
    accessorFn: getNodeKubeletVersion,
  },
  {
    header: 'Machine ID',
    accessorFn: getNodeMachineID,
  },
  {
    header: 'System UUID',
    accessorFn: getNodeSystemUUID,
  },
]
