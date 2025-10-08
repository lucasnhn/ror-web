/*
 * FILE OVERVIEW
 *
 * This file defines the column configuration for displaying data center information in a table.
 * Each column specifies a header label and an accessor function to extract the corresponding value from a `DataCenter` object.
 */

'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  getDatacenterCountry,
  getDatacenterName,
  getDatacenterProvider,
  getDatacenterRegion,
} from '../utils/datacenter'
import { DataCenter } from '@ror/js-api-client'

/**
 * Column definitions for displaying data center information in a table.
 *
 * Each column specifies a header label and an accessor function to retrieve
 * the corresponding value from a `DataCenter` object.
 *
 * @type {ColumnDef<DataCenter>[]}
 */
export const datacenterColumns: ColumnDef<DataCenter>[] = [
  {
    header: 'Name',
    accessorFn: getDatacenterName,
  },
  {
    header: 'Provider',
    accessorFn: getDatacenterProvider,
  },
  {
    header: 'Region',
    accessorFn: getDatacenterRegion,
  },
  {
    header: 'Country',
    accessorFn: getDatacenterCountry,
  },
]
