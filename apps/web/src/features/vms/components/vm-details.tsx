/**
 * VM Details Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that displays detailed information about a Virtual Machine (VM).
 * It uses a clean, responsive CSS grid layout to organize various attributes and actions related to the VM.
 *
 * LAYOUT STRUCTURE:
 * - Left Column (2/3 width): CPU usage, OS info, configuration details, team info
 * - Right Column (1/3 width): Control panel with VM power actions
 * - Responsive design that stacks on smaller screens
 * - Uses shadcn/ui Card components for consistent styling
 *
 */
'use client'

import { useEffect, useState } from 'react'
import { fetchVulnerabilityInfo } from '../actions/vulnerability-actions'
import { useVMContext } from '@/context/vm-context'
import { Pill } from '@/components/shadcn/pill'
import { vmActionsColors } from '../utils/env-colors'

import {
  getVmArchitecture,
  getVmFamily,
  getVmHostName,
  getVmOperatingSystemId,
  getVmName,
  getVmPowerState,
  getVmVersion,
  getSpecSockets,
  getSpecCoresPerSocket,
  getVmToolVersion,
  getTeamValue,
  VMDetailsProps,
  getTeamDescription,
  getLocation,
  getTags,
  getLastUpdated,
  getVmDisks,
} from '../utils/vms'
import { Card, CardContent, CardHeader as ShadcnCardHeader, CardTitle } from '@/components/shadcn/card'
import { DetailedCPUUsage } from './detailed-cpu-usage'
import { DetailedMemoryUsage } from './detailed-memory-usage'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useSearch } from '@/hooks/use-search'
import { Input } from '@/components/shadcn/input'
import { Search } from 'lucide-react'
import Link from 'next/link'

export const VMDetails = ({ user }: VMDetailsProps) => {
  const { vm } = useVMContext()

  const [vulnerabilityData, setVulnerabilityData] = useState<any>(null)

  const cpuSockets = getSpecSockets(vm) || 0
  const cpuCoresPerSocket = getSpecCoresPerSocket(vm) || 0
  const disks = getVmDisks(vm)
  const numberOfDisks = disks.length

  const id = getVmOperatingSystemId(vm)
  const name = getVmName(vm)
  const version = getVmVersion(vm)
  const hostName = getVmHostName(vm)
  const architecture = getVmArchitecture(vm)
  const family = getVmFamily(vm)
  const powerState = getVmPowerState(vm)
  const toolVersion = getVmToolVersion(vm)

  const teamName = getTeamDescription(vm)
  const teamValue = getTeamValue(vm)
  const location = getLocation(vm)
  const lastUpdatedRaw = getLastUpdated(vm)
  const lastUpdated = lastUpdatedRaw
    ? new Date(lastUpdatedRaw).toLocaleString('nb-NO', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : 'Ukjent'

  const tags = getTags(vm)
  const tagKey = Object.keys(tags)

  useEffect(() => {
    const fetchData = async () => {
      if (vm?.metadata?.uid != null) {
        const data = await fetchVulnerabilityInfo(vm.metadata.uid)
        setVulnerabilityData(data)
      } else {
        console.log('VM is null, cannot fetch vulnerability info')
      }
    }
    fetchData()
  }, [vm?.metadata?.uid])
  console.log(user)

  const ConfigurationCard = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>CPU configuration</CardTitle>
          <Badge variant='secondary' className='text-xs'>
            {cpuSockets * cpuCoresPerSocket} cores in total
          </Badge>
        </div>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>CPU Sockets:</span>
            <span className='font-medium'>{cpuSockets}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>CPU Cores per Socket:</span>
            <span className='font-medium'>{cpuCoresPerSocket}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CpuCard = () => {
    return <DetailedCPUUsage />
  }

  const MemoryCard = () => {
    return <DetailedMemoryUsage />
  }

  const DiskCard = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <CardTitle>Disks</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-muted-foreground'>Number of disks:</span>
            <span className='font-xs'>{numberOfDisks}</span>
          </div>
          <div className='flex justify-between items-center'>
            <Link href={`/vms/${hostName.toLowerCase()}/disks`} className='hover:underline'>
              <span className='text-sm text-muted-foreground hover:underline'>More information... </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const TeamCard = () => {
    if (!teamName) {
      return (
        <Card className='bg-slate-50 dark:bg-slate-900/50'>
          <ShadcnCardHeader>
            <CardTitle>Team</CardTitle>
          </ShadcnCardHeader>
          <CardContent>
            <span className='font-medium'>No team assigned</span>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card className='bg-slate-50 dark:bg-slate-900/50'>
        <ShadcnCardHeader>
          <CardTitle>Team</CardTitle>
        </ShadcnCardHeader>
        <CardContent>
          <span className='font-medium'>
            {teamName} ({teamValue})
          </span>
        </CardContent>
      </Card>
    )
  }

  const LocationCard = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <CardTitle>Location</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <span className='font-medium'>{location}</span>
      </CardContent>
    </Card>
  )

  const LastUpdatedCard = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <CardTitle>Last updated</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <span className='font-medium'>{lastUpdated}</span>
      </CardContent>
    </Card>
  )

  const TagCards = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <CardTitle>Available tags</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          {tagKey.map((key) => (
            <div key={key} className='flex justify-between items-start'>
              <span className='text-sm text-muted-foreground font-medium'>{key}:</span>
              <span className='text-sm text-right max-w-[60%]'>{tags[key].description || 'Missing..'}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const VulnerabilityCard = () => {
    const [showAll, setShowAll] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebouncedValue(query, 120)
    const INITIAL_LIMIT = 20

    if (!vulnerabilityData || !vulnerabilityData.resources?.length) {
      return null
    }

    const info = vulnerabilityData.resources[0].virtualMachineVulnerabilityInfo
    if (!info) return null

    const { status } = info

    const cves: string[] = status?.cves || []

    const filteredCves = useSearch<string, { id: string }>(cves, debouncedQuery, {
      keys: ['id'],
      mapItem: (item) => ({ id: item }),
      threshold: 0.3,
    })

    const displayedCves = showAll ? filteredCves : filteredCves.slice(0, INITIAL_LIMIT)
    const hiddenCount = filteredCves.length - INITIAL_LIMIT
    const hasHiddenItems = filteredCves.length > INITIAL_LIMIT

    const severity = status?.severity || 'Unknown'
    const badgeVariant = ['Critical', 'High'].includes(severity)
      ? 'destructive'
      : ['Medium'].includes(severity)
        ? 'default'
        : 'secondary'

    return (
      <Card className='bg-slate-50 dark:bg-slate-900/50'>
        <ShadcnCardHeader className='pb-2'>
          <div className='flex justify-between items-center'>
            <CardTitle>Vulnerabilities</CardTitle>
            <Badge variant={badgeVariant as any} className='text-xs'>
              {severity}
            </Badge>
          </div>
        </ShadcnCardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* Metrics Row */}
            <div className='grid grid-cols-2 gap-1 text-sm'>
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-xs'>Score</span>
                <span className='font-medium'>{status?.severityScore ?? '-'}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-xs'>Last Scanned</span>
                <span className='font-medium'>
                  {status?.lastReportTime ? new Date(status.lastReportTime).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-xs font-medium text-muted-foreground'>Detected CVEs ({filteredCves.length})</span>
              </div>

              <div className='w-full'>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search CVEs...'
                  className='h-8 text-xs'
                  icon={<Search className='w-3.5 h-3.5 text-muted-foreground' />}
                  iconPosition='left'
                />
              </div>

              {/* CVE List Section */}
              {filteredCves.length > 0 ? (
                <div className='flex flex-col gap-2'>
                  <div
                    className={`flex flex-wrap gap-2 transition-all duration-300 ease-in-out ${
                      showAll ? 'max-h-60 overflow-y-auto pr-2' : ''
                    }`}
                  >
                    {displayedCves.map((cve) => (
                      <a
                        key={cve}
                        href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='
                        inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors
                        border-slate-200 bg-white text-blue-600 hover:underline hover:bg-slate-50
                        dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400
                      '
                      >
                        {cve}
                      </a>
                    ))}
                  </div>

                  {hasHiddenItems && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full h-8 text-xs text-muted-foreground hover:text-foreground mt-1'
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? (
                        <span className='flex items-center gap-1'>
                          Show less <ChevronUp className='w-3 h-3' />
                        </span>
                      ) : (
                        <span className='flex items-center gap-1'>
                          Show {hiddenCount} more... <ChevronDown className='w-3 h-3' />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <span className='text-sm text-muted-foreground py-2 block'>
                  {query ? 'No matching CVEs found.' : 'No vulnerabilities found.'}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const InfoCard = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <CardTitle>Operating System</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>ID:</span>
              <span className='font-xs'>{id}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>OS Version:</span>
              <span className='font-xs'>{name}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Version:</span>
              <span className='font-xs'>{version}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Hostname:</span>
              <span className='font-xs'>{hostName}</span>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>VMware Tools:</span>
              <span className='font-xs'>{toolVersion}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Architecture:</span>
              <span className='font-xs'>{architecture}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Family:</span>
              <span className='font-xs'>{family}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ControlPanelCard = () => (
    <Card className='bg-slate-50 dark:bg-slate-900/50'>
      <ShadcnCardHeader>
        <CardTitle>Control Panel</CardTitle>
      </ShadcnCardHeader>
      <CardContent>
        <div className='flex flex-col gap-4 '>
          <div className='flex justify-between items-center '>
            <span className='text-sm text-muted-foreground'>Power State:</span>
            <span className='font-medium'>
              {powerState === 'poweredOn' ? 'On' : powerState === 'poweredOff' ? 'Off' : 'Unknown'}
            </span>
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-muted-foreground'>Actions:</span>
            <div className='flex flex-wrap gap-2'>
              {powerState === 'poweredOff' && (
                <Pill
                  asChild
                  variant={vmActionsColors['powerOn']}
                  className='px-3 cursor-pointer'
                  onClick={() => {
                    // TODO: Implement turn on functionality
                  }}
                >
                  <button type='button'>Turn on</button>
                </Pill>
              )}
              {powerState === 'poweredOn' && (
                <Pill
                  asChild
                  variant={vmActionsColors['powerOff']}
                  className='px-3 cursor-pointer'
                  onClick={() => {
                    // TODO: Implement turn off functionality
                  }}
                >
                  <button type='button'>Turn off</button>
                </Pill>
              )}
              <Pill
                asChild
                variant={vmActionsColors['restart']}
                className='px-3 cursor-pointer'
                onClick={() => {
                  // TODO: Implement restart functionality
                }}
              >
                <button type='button'>Restart</button>
              </Pill>
              <Pill
                asChild
                variant={vmActionsColors['suspend']}
                className='px-3 cursor-pointer'
                onClick={() => {
                  // TODO: Implement suspend functionality
                }}
              >
                <button type='button'>Suspend</button>
              </Pill>
              <Pill
                asChild
                variant={vmActionsColors['delete']}
                className='px-3 cursor-pointer'
                onClick={() => {
                  // TODO: Implement delete functionality
                }}
              >
                <button type='button'>Delete</button>
              </Pill>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className={'space-y-4 mb-4'}>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <TeamCard />
            <LocationCard />
            <LastUpdatedCard />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ConfigurationCard />
            <DiskCard />
            {/* <MemoryCard /> */}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <CpuCard />
            <MemoryCard />
          </div>
        </div>
        <div className='lg:col-span-1 space-y-4'>
          <ControlPanelCard />
          <InfoCard />
          <TagCards />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-1'>
        <VulnerabilityCard />
      </div>
    </div>
  )
}
