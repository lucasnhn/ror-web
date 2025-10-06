/*
 * FILE OVERVIEW
 *
 * This file defines the column configuration for displaying price information in a table.
 * Each column specifies a header label and an accessor function to extract the corresponding value from a `Price` object.
 */

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Price } from '@/types/prices'
import {
  getPriceCpu,
  getPriceFrom,
  getPriceMachineClass,
  getPriceMemory,
  getPriceProvider,
  getPriceTo,
  getPriceValue,
} from '../utils/price'

/**
 * Column definitions for displaying price information in a table.
 *
 * Each column is configured with a header label and an accessor function
 * that extracts the corresponding value from a `Price` object.
 */
export const pricesColumns: ColumnDef<Price>[] = [
  {
    header: 'Machine class',
    accessorFn: getPriceMachineClass,
  },
  {
    header: 'Price per node',
    accessorFn: (price) => getPriceValue(price) + ' nok',
  },
  {
    header: 'CPU',
    accessorFn: getPriceCpu,
  },
  {
    header: 'Memory',
    accessorFn: getPriceMemory,
  },
  {
    header: 'Provider',
    accessorFn: getPriceProvider,
  },
  {
    header: 'From',
    accessorFn: (price) => new Date(getPriceFrom(price)),
    cell: (info) =>
      info.getValue<Date>().toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
  },
  {
    header: 'To',
    accessorFn: (price) => new Date(getPriceTo(price)),
    cell: (info) =>
      info.getValue<Date>().toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
  },
]
