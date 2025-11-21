// 'use client'

// import { Button } from '@/components/shadcn/button'
// import { useClusterContext } from '@/context/cluster-context'
// import { Layer } from '@ror/react'
// import { ExternalLink } from 'lucide-react'
// import { User } from 'next-auth'
// import { toast } from 'sonner'
// import type { Layout, Layouts } from 'react-grid-layout'
// import 'react-grid-layout/css/styles.css'
// import 'react-resizable/css/styles.css'
// import { CodeSnippet } from '../../../components/ui/code-snippet'
// import { formatObservationDate, formatResource } from '../utils/formats'
// import {
//   getClusterId,
//   getClusterResource,
//   getCreated,
//   getDatacenter,
//   getHaClusterPlaneValue,
//   getKubectlLogin,
//   getLastObserved,
//   getPrices,
//   getProject,
//   getProvider,
//   getRorLogin,
//   getTools,
//   getVersions,
//   getWorkspace,
// } from '../utils/cluster'
// import { standardLayouts } from '../config/cluster-details-layouts'
// import { GridLayoutWrapper } from '@/components/ui/grid-layout-wrapper'
// import { CardHeader, CardItem } from '@/components/ui/grid-layout-card'
// import { useLayoutPreferences } from '@/hooks/use-layout-preferences'
// import { useRef } from 'react'

// interface ClusterDetailsProps {
//   user?: User
//   className?: string
// }

// const LOG_NS = '[ClusterDetails]'

// /**
//  * Displays detailed information about a cluster, including resources, metadata, tools, versions, and pricing.
//  *
//  * @param user - The current user object, used for personalized cluster access information.
//  * @param className - Optional CSS class for custom styling of the grid layout wrapper.
//  *
//  * @returns A React component rendering cluster details in a draggable, responsive grid layout.
//  */
// export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
//   const { cluster } = useClusterContext()
//   const applyingRef = useRef(false)

//   const {
//     layouts,
//     setLayouts,
//     layoutKey,
//     currentBreakpoint,
//     setCurrentBreakpoint,
//     saveLayouts,
//     resetToSaved,
//     resetToDefault,
//     getCurrentLayouts,
//   } = useLayoutPreferences('clusterCards', standardLayouts)
//   console.info(`${LOG_NS} render`, {
//     layoutKey,
//     currentBreakpoint,
//     keys: Object.keys(layouts || {}),
//     bpItems: (layouts?.[currentBreakpoint] || []).length,
//   })

//   // const onLayoutChange = (layout: Layout[]) => {
//   //   if (applyingRef.current) {
//   //     console.info('[ClusterDetails] onLayoutChange swallowed (post-reset)', { bp: currentBreakpoint })
//   //     applyingRef.current = false
//   //     return
//   //   }
//   //   console.info('[ClusterDetails] onLayoutChange applied', { bp: currentBreakpoint, count: layout.length })
//   //   setLayouts({
//   //     ...layouts,
//   //     [currentBreakpoint]: layout,
//   //   })
//   // }

//   const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
//     if (applyingRef.current) {
//       console.info('[ClusterDetails] onLayoutChange swallowed (post-reset)', { bp: currentBreakpoint })
//       applyingRef.current = false
//       return
//     }

//     console.info('[ClusterDetails] onLayoutChange applied', {
//       bp: currentBreakpoint,
//       count: currentLayout.length,
//     })

//     // Single source of truth for ReactGridLayout layouts
//     setLayouts(allLayouts)
//   }

//   const clusterId = getClusterId(cluster)
//   const cpu = getClusterResource(cluster, 'cpu')
//   const memory = getClusterResource(cluster, 'memory')
//   const gpu = getClusterResource(cluster, 'gpu')
//   const disk = getClusterResource(cluster, 'disk')
//   const tools = getTools(cluster)
//   const prices = getPrices(cluster)
//   const lastObserved = getLastObserved(cluster)
//   const created = getCreated(cluster)
//   const rorLogin = getRorLogin(cluster)
//   const kubectlLogin = getKubectlLogin(cluster, user?.email || '<user-email missing>')
//   const versions = getVersions(cluster)
//   const project = getProject(cluster)
//   const workspace = getWorkspace(cluster)
//   const datacenter = getDatacenter(cluster)
//   const provider = getProvider(cluster)

//   // const LayoutButtons = () => (
//   //   <div className='flex sm:flex-row flex-col gap-2 mb-3'>
//   //     <Button
//   //       onClick={() => {
//   //         const newLayouts: Layouts = { ...layouts, [currentBreakpoint]: layouts[currentBreakpoint] }
//   //         console.info(`${LOG_NS} Save layout click`, {
//   //           currentBreakpoint,
//   //           beforeCount: (layouts?.[currentBreakpoint] || []).length,
//   //           keys: Object.keys(layouts || {}),
//   //         })
//   //         saveLayouts(newLayouts)
//   //         toast.info('Layout saved')
//   //       }}
//   //     >
//   //       Save layout
//   //     </Button>
//   //     <Button
//   //       onClick={() => {
//   //         console.info(`${LOG_NS} Reset to saved click`)
//   //         resetToSaved()
//   //       }}
//   //     >
//   //       Reset to saved
//   //     </Button>
//   //     <Button
//   //       onClick={() => {
//   //         console.info(`${LOG_NS} Reset to default click`)
//   //         resetToDefault()
//   //       }}
//   //     >
//   //       Reset to default
//   //     </Button>
//   //   </div>
//   // )

//   const LayoutButtons = () => (
//     <div className='flex sm:flex-row flex-col gap-2 mb-3'>
//       <Button
//         onClick={() => {
//           console.info(`${LOG_NS} Save layout click`, {
//             currentBreakpoint,
//             beforeCount: (layouts?.[currentBreakpoint] || []).length,
//             keys: Object.keys(layouts || {}),
//           })
//           // layouts is already the full, up-to-date Layouts object
//           saveLayouts(layouts)
//           toast.info('Layout saved')
//         }}
//       >
//         Save layout
//       </Button>
//       <Button
//         onClick={() => {
//           console.info(`${LOG_NS} Reset to saved click`)
//           applyingRef.current = true // <-- arm the guard
//           resetToSaved()
//         }}
//       >
//         Reset to saved
//       </Button>
//       <Button
//         onClick={() => {
//           console.info(`${LOG_NS} Reset to default click`)
//           applyingRef.current = true // <-- arm the guard
//           resetToDefault()
//         }}
//       >
//         Reset to default
//       </Button>
//     </div>
//   )

//   const MemoryCard = () => (
//     <>
//       <CardHeader title='Memory' />
//       <div className='flex flex-col gap-2'>
//         <CardItem label='CPU'>{formatResource('cpu', cpu)}</CardItem>
//         <CardItem label='Memory'>{formatResource('memory', memory)}</CardItem>
//         <CardItem label='GPU'>{formatResource('gpu', gpu)}</CardItem>
//         <CardItem label='Disk'>{formatResource('disk', disk)}</CardItem>
//       </div>
//     </>
//   )

//   const InfoCard = () => (
//     <>
//       <CardHeader title='Information' />
//       <div className='flex gap-2'>
//         <div className='flex flex-1 flex-col gap-2'>
//           <CardItem label='Cluster ID:'>{clusterId}</CardItem>
//           <CardItem label='Project:'>{project}</CardItem>
//           <CardItem label='Workspace:'>{workspace}</CardItem>
//           <CardItem label='Datacenter:'>{datacenter}</CardItem>
//         </div>
//         <div className='flex flex-1 flex-col gap-2'>
//           <CardItem label='Provider:'>{provider}</CardItem>
//           <CardItem label='HA control plane:'>{getHaClusterPlaneValue(cluster)}</CardItem>
//           <CardItem label='Egress IP:'>MOCK EGRESS IP</CardItem>
//         </div>
//       </div>
//     </>
//   )

//   const ObservedCard = () => (
//     <>
//       <CardHeader title='Observed' />
//       <div className='flex flex-col gap-2'>
//         <CardItem label='Last observed:'>
//           {lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}
//         </CardItem>
//         <CardItem label='Created:'>{created ? formatObservationDate(created.toString()) : 'Missing…'}</CardItem>
//       </div>
//     </>
//   )

//   const ToolsCard = () => (
//     <>
//       <CardHeader title='Tools' />
//       <div className='flex flex-col gap-2'>
//         <section className='flex flex-col'>
//           {tools.argo ? (
//             <a
//               onClick={(e) => e.stopPropagation()}
//               href={`https://${tools.argo}`}
//               target='_blank'
//               rel='noopener noreferrer'
//               className='flex gap-2 font-bold text-blue-500 w-fit'
//             >
//               <span>ArgoCD</span>
//               <ExternalLink className='w-5 h-5' />
//             </a>
//           ) : (
//             <p className='flex [@container(max-width:360px)]:flex-col overflow-none'>
//               <span className='font-bold'>ArgoCD &nbsp;</span>
//               <span>missing ...</span>
//             </p>
//           )}
//         </section>
//         <Layer level={2}>
//           <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
//         </Layer>
//         <Layer level={2}>
//           <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
//         </Layer>
//       </div>
//     </>
//   )

//   const VersionsCard = () => (
//     <>
//       <CardHeader title='Versions' />
//       <div className='flex flex-col gap-3'>
//         <div className='flex flex-col gap-1'>
//           <b>Tooling version: </b>
//           <span>{versions.nhnTooling.version}</span>
//         </div>
//         <div className='flex flex-col gap-1'>
//           <b>Agent version: </b>
//           <span>{versions.agent.version}</span>
//         </div>
//         <div className='flex flex-col gap-1'>
//           <b>Kubernetes version: </b>
//           <span>{versions.kubernetes.version}</span>
//         </div>
//       </div>
//     </>
//   )

//   const PricesCard = () => (
//     <>
//       <CardHeader title='Prices' />
//       <div className='flex flex-col gap-2'>
//         <span>
//           <b>Monthly price: </b> {prices.monthly || 0} kr
//         </span>
//         <span>
//           <b>Yearly price: </b> {prices.yearly || 0} kr
//         </span>
//       </div>
//     </>
//   )

//   // const onLayoutChange = (layout: Layout[]) => {
//   //   console.info(`${LOG_NS} onLayoutChange`, {
//   //     currentBreakpoint,
//   //     itemCount: layout.length,
//   //     sample: layout.slice(0, 3),
//   //   })
//   //   setLayouts({ ...layouts, [currentBreakpoint]: layout })
//   // }

//   const onBreakpointChange = (bp: string) => {
//     console.info(`${LOG_NS} onBreakpointChange`, { from: currentBreakpoint, to: bp })
//     setCurrentBreakpoint(bp)
//   }
//   const currentLayouts = () => {
//     return getCurrentLayouts()
//   }

//   return (
//     <div>
//       <div className='flex flex-col gap-12'>
//         <div className='flex gap-20'>
//           <div className='flex flex-col gap-4'>
//             <pre className='whitespace-pre-wrap break-words'>{JSON.stringify(currentLayouts(), null, 4)}</pre>
//             <pre className='whitespace-pre-wrap break-words'>
//               {`Active layouts (hook state):\n${JSON.stringify(layouts, null, 2)}`}
//             </pre>
//             <pre className='whitespace-pre-wrap break-words'>
//               {`currentBreakpoint: ${currentBreakpoint} | layoutKey: ${layoutKey}`}
//             </pre>
//           </div>
//         </div>
//       </div>
//       <LayoutButtons />
//       <GridLayoutWrapper
//         className={className}
//         layouts={layouts}
//         layoutKey={layoutKey}
//         onLayoutChange={onLayoutChange}
//         onBreakpointChange={onBreakpointChange}
//       >
//         <div key='memory' className='drag-handle'>
//           <MemoryCard />
//         </div>
//         <div key='info' className='drag-handle'>
//           <InfoCard />
//         </div>
//         <div key='observed' className='drag-handle'>
//           <ObservedCard />
//         </div>
//         <div key='tools' className='drag-handle'>
//           <ToolsCard />
//         </div>
//         <div key='versions' className='drag-handle'>
//           <VersionsCard />
//         </div>
//         <div key='prices' className='drag-handle'>
//           <PricesCard />
//         </div>
//       </GridLayoutWrapper>
//     </div>
//   )
// }

// 'use client'

// import { useState } from 'react'
// import { useClusterContext } from '@/context/cluster-context'
// import { User } from 'next-auth'
// import { toast } from 'sonner'
// import { GridstackWrapper, type GridstackItem } from '@/components/ui/gridstack-wrapper'
// import { CardHeader, CardItem } from '@/components/ui/grid-layout-card'
// import { Layer } from '@ror/react'
// import { ExternalLink } from 'lucide-react'
// import { CodeSnippet } from '@/components/ui/code-snippet'
// import {
//   getClusterId,
//   getClusterResource,
//   getCreated,
//   getDatacenter,
//   getHaClusterPlaneValue,
//   getKubectlLogin,
//   getLastObserved,
//   getPrices,
//   getProject,
//   getProvider,
//   getRorLogin,
//   getTools,
//   getVersions,
//   getWorkspace,
// } from '../utils/cluster'
// import { formatObservationDate, formatResource } from '../utils/formats'
// import 'gridstack/dist/gridstack.min.css';
// import { useEffect, useRef } from 'react';
// import { GridStack } from 'gridstack';

// interface ClusterDetailsProps {
//   user?: User
//   className?: string
// }

// const initialItems: GridstackItem[] = [
//   { id: 'memory',   x: 0,  y: 0,  w: 4, h: 8 },
//   { id: 'info',     x: 4,  y: 0,  w: 8, h: 8 },
//   { id: 'observed', x: 0,  y: 8,  w: 4, h: 6 },
//   { id: 'tools',    x: 4,  y: 8,  w: 8, h: 8 },
//   { id: 'versions', x: 0,  y: 14, w: 6, h: 6 },
//   { id: 'prices',   x: 6,  y: 14, w: 6, h: 4 },
// ]

// export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
//   const { cluster } = useClusterContext()
//   const [items, setItems] = useState<GridstackItem[]>(initialItems)
//   const gridRef = useRef(null);

//   const clusterId = getClusterId(cluster)
//   const cpu = getClusterResource(cluster, 'cpu')
//   const memory = getClusterResource(cluster, 'memory')
//   const gpu = getClusterResource(cluster, 'gpu')
//   const disk = getClusterResource(cluster, 'disk')
//   const tools = getTools(cluster)
//   const prices = getPrices(cluster)
//   const lastObserved = getLastObserved(cluster)
//   const created = getCreated(cluster)
//   const rorLogin = getRorLogin(cluster)
//   const kubectlLogin = getKubectlLogin(cluster, user?.email || '<user-email missing>')
//   const versions = getVersions(cluster)
//   const project = getProject(cluster)
//   const workspace = getWorkspace(cluster)
//   const datacenter = getDatacenter(cluster)
//   const provider = getProvider(cluster)

//   useEffect(() => {
//     const grid = GridStack.init({}, gridRef.current!);
//     grid.load([
//       {x: 0, y: 0, w: 4, h: 2, content: 'Widget 1'},
//       {x: 4, y: 0, w: 4, h: 4, content: 'Widget 2'},
//     ]);
//   }, []);

//   const MemoryCard = () => (
//     <>
//       <CardHeader title="Memory" />
//       <div className="flex flex-col gap-2">
//         <CardItem label="CPU">{formatResource('cpu', cpu)}</CardItem>
//         <CardItem label="Memory">{formatResource('memory', memory)}</CardItem>
//         <CardItem label="GPU">{formatResource('gpu', gpu)}</CardItem>
//         <CardItem label="Disk">{formatResource('disk', disk)}</CardItem>
//       </div>
//     </>
//   )

//   const InfoCard = () => (
//     <>
//       <CardHeader title="Information" />
//       <div className="flex gap-2">
//         <div className="flex flex-1 flex-col gap-2">
//           <CardItem label="Cluster ID:">{clusterId}</CardItem>
//           <CardItem label="Project:">{project}</CardItem>
//           <CardItem label="Workspace:">{workspace}</CardItem>
//           <CardItem label="Datacenter:">{datacenter}</CardItem>
//         </div>
//         <div className="flex flex-1 flex-col gap-2">
//           <CardItem label="Provider:">{provider}</CardItem>
//           <CardItem label="HA control plane:">{getHaClusterPlaneValue(cluster)}</CardItem>
//           <CardItem label="Egress IP:">MOCK EGRESS IP</CardItem>
//         </div>
//       </div>
//     </>
//   )

//   const ObservedCard = () => (
//     <>
//       <CardHeader title="Observed" />
//       <div className="flex flex-col gap-2">
//         <CardItem label="Last observed:">
//           {lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}
//         </CardItem>
//         <CardItem label="Created:">
//           {created ? formatObservationDate(created.toString()) : 'Missing…'}
//         </CardItem>
//       </div>
//     </>
//   )

//   const ToolsCard = () => (
//     <>
//       <CardHeader title="Tools" />
//       <div className="flex flex-col gap-2">
//         <section className="flex flex-col">
//           {tools.argo ? (
//             <a
//               onClick={(e) => e.stopPropagation()}
//               href={`https://${tools.argo}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex gap-2 font-bold text-blue-500 w-fit"
//             >
//               <span>ArgoCD</span>
//               <ExternalLink className="w-5 h-5" />
//             </a>
//           ) : (
//             <p className="flex [@container(max-width:360px)]:flex-col overflow-none">
//               <span className="font-bold">ArgoCD &nbsp;</span>
//               <span>missing ...</span>
//             </p>
//           )}
//         </section>
//         <Layer level={2}>
//           <CodeSnippet type="single">{rorLogin}</CodeSnippet>
//         </Layer>
//         <Layer level={2}>
//           <CodeSnippet type="single">{kubectlLogin}</CodeSnippet>
//         </Layer>
//       </div>
//     </>
//   )

//   const VersionsCard = () => (
//     <>
//       <CardHeader title="Versions" />
//       <div className="flex flex-col gap-3">
//         <div className="flex flex-col gap-1">
//           <b>Tooling version: </b>
//           <span>{versions.nhnTooling.version}</span>
//         </div>
//         <div className="flex flex-col gap-1">
//           <b>Agent version: </b>
//           <span>{versions.agent.version}</span>
//         </div>
//         <div className="flex flex-col gap-1">
//           <b>Kubernetes version: </b>
//           <span>{versions.kubernetes.version}</span>
//         </div>
//       </div>
//     </>
//   )

//   const PricesCard = () => (
//     <>
//       <CardHeader title="Prices" />
//       <div className="flex flex-col gap-2">
//         <span>
//           <b>Monthly price: </b> {prices.monthly || 0} kr
//         </span>
//         <span>
//           <b>Yearly price: </b> {prices.yearly || 0} kr
//         </span>
//       </div>
//     </>
//   )

//   return (
//     <div className={className}>
//       {/* <GridstackWrapper
//         items={items}
//         onChange={(updated) => {
//           setItems(updated)
//           // here you can also call your useLayoutPreferences.saveLayouts-style logic
//           toast.info('Layout updated')
//         }}
//       >
//         {(item) => {
//           switch (item.id) {
//             case 'memory':
//               return <MemoryCard />
//             case 'info':
//               return <InfoCard />
//             case 'observed':
//               return <ObservedCard />
//             case 'tools':
//               return <ToolsCard />
//             case 'versions':
//               return <VersionsCard />
//             case 'prices':
//               return <PricesCard />
//             default:
//               return <div>Unknown card: {item.id}</div>
//           }
//         }}
//       </GridstackWrapper> */}
//       <div className="grid-stack" ref={gridRef}></div>
//     </div>
//   )
// }

// 'use client'

// import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
// import { GridStack } from 'gridstack'
// import 'gridstack/dist/gridstack.min.css'

// import { toast } from 'sonner'
// import { User } from 'next-auth'
// import { ExternalLink } from 'lucide-react'
// import { Layer } from '@ror/react'

// import { useClusterContext } from '@/context/cluster-context'
// import { CardHeader, CardItem } from '@/components/ui/grid-layout-card'
// import { CodeSnippet } from '@/components/ui/code-snippet'
// import {
//   getClusterId,
//   getClusterResource,
//   getCreated,
//   getDatacenter,
//   getHaClusterPlaneValue,
//   getKubectlLogin,
//   getLastObserved,
//   getPrices,
//   getProject,
//   getProvider,
//   getRorLogin,
//   getTools,
//   getVersions,
//   getWorkspace,
// } from '../utils/cluster'
// import { formatObservationDate, formatResource } from '../utils/formats'
// // import { type GridstackItem } from '@/components/ui/gridstack-wrapper'

// interface ClusterDetailsProps {
//   user?: User
//   className?: string
// }

// type WidgetItem = {
//   id: string
//   x: number
//   y: number
//   w: number
//   h: number
//   content: React.ReactNode
// }

// export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
//   const { cluster } = useClusterContext()
//   const gridRef = useRef<HTMLDivElement | null>(null)

//   const clusterId = getClusterId(cluster)
//   const cpu = getClusterResource(cluster, 'cpu')
//   const memory = getClusterResource(cluster, 'memory')
//   const gpu = getClusterResource(cluster, 'gpu')
//   const disk = getClusterResource(cluster, 'disk')
//   const tools = getTools(cluster)
//   const prices = getPrices(cluster)
//   const lastObserved = getLastObserved(cluster)
//   const created = getCreated(cluster)
//   const rorLogin = getRorLogin(cluster)
//   const kubectlLogin = getKubectlLogin(cluster, user?.email || '<user-email missing>')
//   const versions = getVersions(cluster)
//   const project = getProject(cluster)
//   const workspace = getWorkspace(cluster)
//   const datacenter = getDatacenter(cluster)
//   const provider = getProvider(cluster)

//   const MemoryCard = useCallback(
//     () => (
//       <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
//         <CardHeader title='Memory' />
//         <div className='flex flex-col gap-2'>
//           <CardItem label='CPU'>{formatResource('cpu', cpu)}</CardItem>
//           <CardItem label='Memory'>{formatResource('memory', memory)}</CardItem>
//           <CardItem label='GPU'>{formatResource('gpu', gpu)}</CardItem>
//           <CardItem label='Disk'>{formatResource('disk', disk)}</CardItem>
//         </div>
//       </div>
//     ),
//     [cpu, memory, gpu, disk]
//   )

//   const InfoCard = useCallback(
//     () => (
//       <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
//         <CardHeader title='Information' />
//         <div className='flex gap-2'>
//           <div className='flex flex-1 flex-col gap-2'>
//             <CardItem label='Cluster ID:'>{clusterId}</CardItem>
//             <CardItem label='Project:'>{project}</CardItem>
//             <CardItem label='Workspace:'>{workspace}</CardItem>
//             <CardItem label='Datacenter:'>{datacenter}</CardItem>
//           </div>
//           <div className='flex flex-1 flex-col gap-2'>
//             <CardItem label='Provider:'>{provider}</CardItem>
//             <CardItem label='HA control plane:'>{getHaClusterPlaneValue(cluster)}</CardItem>
//             <CardItem label='Egress IP:'>MOCK EGRESS IP</CardItem>
//           </div>
//         </div>
//       </div>
//     ),
//     [cluster, clusterId, datacenter, provider, project, workspace]
//   )

//   const ObservedCard = useCallback(
//     () => (
//       <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
//         <CardHeader title='Observed' />
//         <div className='flex flex-col gap-2'>
//           <CardItem label='Last observed:'>
//             {lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}
//           </CardItem>
//           <CardItem label='Created:'>{created ? formatObservationDate(created.toString()) : 'Missing…'}</CardItem>
//         </div>
//       </div>
//     ),
//     [lastObserved, created]
//   )

//   const ToolsCard = useCallback(
//     () => (
//       <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
//         <CardHeader title='Tools' />
//         <div className='flex flex-col gap-2'>
//           <section className='flex flex-col'>
//             {tools.argo ? (
//               <a
//                 onClick={(e) => e.stopPropagation()}
//                 href={`https://${tools.argo}`}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='flex gap-2 font-bold text-blue-500 w-fit'
//               >
//                 <span>ArgoCD</span>
//                 <ExternalLink className='w-5 h-5' />
//               </a>
//             ) : (
//               <p className='flex [@container(max-width:360px)]:flex-col overflow-none'>
//                 <span className='font-bold'>ArgoCD &nbsp;</span>
//                 <span>missing ...</span>
//               </p>
//             )}
//           </section>
//           <Layer level={2}>
//             <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
//           </Layer>
//           <Layer level={2}>
//             <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
//           </Layer>
//         </div>
//       </div>
//     ),
//     [tools, rorLogin, kubectlLogin]
//   )

//   const VersionsCard = useCallback(
//     () => (
//       <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
//         <CardHeader title='Versions' />
//         <div className='flex flex-col gap-3'>
//           <div className='flex flex-col gap-1'>
//             <b>Tooling version: </b>
//             <span>{versions.nhnTooling.version}</span>
//           </div>
//           <div className='flex flex-col gap-1'>
//             <b>Agent version: </b>
//             <span>{versions.agent.version}</span>
//           </div>
//           <div className='flex flex-col gap-1'>
//             <b>Kubernetes version: </b>
//             <span>{versions.kubernetes.version}</span>
//           </div>
//         </div>
//       </div>
//     ),
//     [versions]
//   )

//   const PricesCard = useCallback(
//     () => (
//       <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
//         <CardHeader title='Prices' />
//         <div className='flex flex-col gap-2'>
//           <span>
//             <b>Monthly price: </b> {prices.monthly || 0} kr
//           </span>
//           <span>
//             <b>Yearly price: </b> {prices.yearly || 0} kr
//           </span>
//         </div>
//       </div>
//     ),
//     [prices]
//   )

//   // Widgets defined here
//   const items: WidgetItem[] = useMemo(
//     () => [
//       {
//         id: 'memory',
//         x: 0,
//         y: 0,
//         w: 4,
//         h: 8,
//         content: <MemoryCard />,
//       },
//       {
//         id: 'info',
//         x: 4,
//         y: 0,
//         w: 8,
//         h: 8,
//         content: <InfoCard />,
//       },
//       {
//         id: 'observed',
//         x: 0,
//         y: 8,
//         w: 4,
//         h: 6,
//         content: <ObservedCard />,
//       },
//       {
//         id: 'tools',
//         x: 4,
//         y: 8,
//         w: 8,
//         h: 8,
//         content: <ToolsCard />,
//       },
//       {
//         id: 'versions',
//         x: 0,
//         y: 14,
//         w: 6,
//         h: 6,
//         content: <VersionsCard />,
//       },
//       {
//         id: 'prices',
//         x: 6,
//         y: 14,
//         w: 6,
//         h: 4,
//         content: <PricesCard />,
//       },
//     ],
//     [MemoryCard, InfoCard, ObservedCard, ToolsCard, VersionsCard, PricesCard]
//   )
//   useEffect(() => {
//     if (!gridRef.current) return

//     const opts: GridStackOptions = {
//       // version‑12 uses CSS variables for layout, less custom CSS required. :contentReference[oaicite:2]{index=2}
//       cellHeight: 100,
//       float: true,
//       margin: 5,
//     }

//     const grid = GridStack.init(opts, gridRef.current)

//     // Option A: Load items from JSON
//     const serialized = items.map((item) => ({
//       x: item.x,
//       y: item.y,
//       w: item.w,
//       h: item.h,
//       id: item.id,
//       content: '', // content will be in DOM as we render below
//     }))
//     grid.load(serialized)

//     return () => grid.destroy(false)
//   }, [items])

//   // const grid = GridStack.init()
//   // grid.load(items)

//   return (
//     // <div className={className}>
//     //   <div className="grid-stack" ref={gridRef}>
//     //     {widgets.map(widget => (
//     //       <GridstackItem
//     //         key={widget.id}
//     //         className="grid-stack-item"
//     //         data-gs-x={widget.x}
//     //         data-gs-y={widget.y}
//     //         data-gs-w={widget.minWidth}
//     //         data-gs-h={widget.minHeight}
//     //       >
//     //         <div className="grid-stack-item-content h-full overflow-hidden">
//     //           {widget.content}
//     //         </div>
//     //       </GridstackItem>
//     //     ))}
//     //   </div>
//     // </div>

//     <div className='grid-stack' ref={gridRef}>
//       {items.map((item) => (
//         <div
//           key={item.id}
//           className='grid-stack-item'
//           data-gs-x={item.x}
//           data-gs-y={item.y}
//           data-gs-w={item.w}
//           data-gs-h={item.h}
//         >
//           <div className='grid-stack-item-content'>{item.content}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

'use client'

import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'

import { toast } from 'sonner'
import { User } from 'next-auth'
import { ExternalLink } from 'lucide-react'
import { Layer } from '@ror/react'

import { useClusterContext } from '@/context/cluster-context'
import { CardHeader, CardItem } from '@/components/ui/grid-layout-card'
import { CodeSnippet } from '@/components/ui/code-snippet'
import {
  getClusterId,
  getClusterResource,
  getCreated,
  getDatacenter,
  getHaClusterPlaneValue,
  getKubectlLogin,
  getLastObserved,
  getPrices,
  getProject,
  getProvider,
  getRorLogin,
  getTools,
  getVersions,
  getWorkspace,
} from '../utils/cluster'
import { formatObservationDate, formatResource } from '../utils/formats'
// import { type GridstackItem } from '@/components/ui/gridstack-wrapper'

interface ClusterDetailsProps {
  user?: User
  className?: string
}

type WidgetItem = {
  id: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  content: React.ReactNode
}
import { type GridStackNode } from 'gridstack'
import { createRoot } from 'react-dom/client'

const reactRoots = new WeakMap<Element, ReturnType<typeof createRoot>>()

export const ClusterDetails = ({ user, className }: ClusterDetailsProps) => {
  const { cluster } = useClusterContext()
  const gridRef = useRef<GridStack | null>(null)
  const didInitRef = useRef(false)

  const clusterId = getClusterId(cluster)
  const cpu = getClusterResource(cluster, 'cpu')
  const memory = getClusterResource(cluster, 'memory')
  const gpu = getClusterResource(cluster, 'gpu')
  const disk = getClusterResource(cluster, 'disk')
  const tools = getTools(cluster)
  const prices = getPrices(cluster)
  const lastObserved = getLastObserved(cluster)
  const created = getCreated(cluster)
  const rorLogin = getRorLogin(cluster)
  const kubectlLogin = getKubectlLogin(cluster, user?.email || '<user-email missing>')
  const versions = getVersions(cluster)
  const project = getProject(cluster)
  const workspace = getWorkspace(cluster)
  const datacenter = getDatacenter(cluster)
  const provider = getProvider(cluster)

  const MemoryCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Memory' />
        <div className='flex flex-col gap-2'>
          <CardItem label='CPU'>{formatResource('cpu', cpu)}</CardItem>
          <CardItem label='Memory'>{formatResource('memory', memory)}</CardItem>
          <CardItem label='GPU'>{formatResource('gpu', gpu)}</CardItem>
          <CardItem label='Disk'>{formatResource('disk', disk)}</CardItem>
        </div>
      </div>
    ),
    [cpu, memory, gpu, disk]
  )

  const InfoCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Information' />
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <CardItem label='Cluster ID:'>{clusterId}</CardItem>
            <CardItem label='Project:'>{project}</CardItem>
            <CardItem label='Workspace:'>{workspace}</CardItem>
            <CardItem label='Datacenter:'>{datacenter}</CardItem>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <CardItem label='Provider:'>{provider}</CardItem>
            <CardItem label='HA control plane:'>{getHaClusterPlaneValue(cluster)}</CardItem>
            <CardItem label='Egress IP:'>MOCK EGRESS IP</CardItem>
          </div>
        </div>
      </div>
    ),
    [cluster, clusterId, datacenter, provider, project, workspace]
  )

  const ObservedCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Observed' />
        <div className='flex flex-col gap-2'>
          <CardItem label='Last observed:'>
            {lastObserved ? formatObservationDate(lastObserved.toString()) : 'Missing…'}
          </CardItem>
          <CardItem label='Created:'>{created ? formatObservationDate(created.toString()) : 'Missing…'}</CardItem>
        </div>
      </div>
    ),
    [lastObserved, created]
  )

  const ToolsCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Tools' />
        <div className='flex flex-col gap-2'>
          <section className='flex flex-col'>
            {tools.argo ? (
              <a
                onClick={(e) => e.stopPropagation()}
                href={`https://${tools.argo}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex gap-2 font-bold text-blue-500 w-fit'
              >
                <span>ArgoCD</span>
                <ExternalLink className='w-5 h-5' />
              </a>
            ) : (
              <p className='flex [@container(max-width:360px)]:flex-col overflow-none'>
                <span className='font-bold'>ArgoCD &nbsp;</span>
                <span>missing ...</span>
              </p>
            )}
          </section>
          <section className='flex flex-col'>
            {tools.grafana ? (
              <a
                onClick={(e) => e.stopPropagation()}
                href={`https://${tools.grafana}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex gap-2 font-bold text-blue-500 w-fit'
              >
                <span>Grafana</span>
                <ExternalLink className='w-5 h-5' />
              </a>
            ) : (
              <p className='flex [@container(max-width:360px)]:flex-col overflow-none'>
                <span className='font-bold'>Grafana &nbsp;</span>
                <span>missing ...</span>
              </p>
            )}
          </section>
          <Layer level={2}>
            <CodeSnippet type='single'>{rorLogin}</CodeSnippet>
          </Layer>
          <Layer level={2}>
            <CodeSnippet type='single'>{kubectlLogin}</CodeSnippet>
          </Layer>
        </div>
      </div>
    ),
    [tools, rorLogin, kubectlLogin]
  )

  const VersionsCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Versions' />
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <b>Tooling version: </b>
            <span>{versions.nhnTooling.version}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <b>Agent version: </b>
            <span>{versions.agent.version}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <b>Kubernetes version: </b>
            <span>{versions.kubernetes.version}</span>
          </div>
        </div>
      </div>
    ),
    [versions]
  )

  const PricesCard = useCallback(
    () => (
      <div className='h-full w-full flex flex-col bg-(--r-layer) p-4 rounded-md'>
        <CardHeader title='Prices' />
        <div className='flex flex-col gap-2'>
          <span>
            <b>Monthly price: </b> {prices.monthly || 0} kr
          </span>
          <span>
            <b>Yearly price: </b> {prices.yearly || 0} kr
          </span>
        </div>
      </div>
    ),
    [prices]
  )

  const items: WidgetItem[] = useMemo(
    () => [
      { id: 'memory', x: 5, y: 0, w: 2, h: 10, minW: 2, minH: 10, content: <MemoryCard /> },
      { id: 'info', x: 0, y: 0, w: 5, h: 10, minW: 3, minH: 10, content: <InfoCard /> },
      { id: 'observed', x: 4, y: 10, w: 3, h: 10, minW: 2, minH: 6, content: <ObservedCard /> },
      { id: 'tools', x: 7, y: 0, w: 3, h: 10, minW: 2, minH: 8, content: <ToolsCard /> },
      { id: 'versions', x: 0, y: 10, w: 4, h: 10, minW: 2, minH: 9, content: <VersionsCard /> },
      { id: 'prices', x: 7, y: 10, w: 3, h: 10, minW: 2, minH: 4, content: <PricesCard /> },
    ],
    [MemoryCard, InfoCard, ObservedCard, ToolsCard, VersionsCard, PricesCard]
  )

  const addNewWidget = useCallback(() => {
    if (!gridRef.current) return

    items.forEach((item) => {
      const node: GridStackNode = {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
      }

      const el = gridRef.current.addWidget(node)
      const contentEl = el.querySelector('.grid-stack-item-content')!
      const root = createRoot(contentEl)
      reactRoots.set(contentEl, root)
      root.render(item.content)
    })
  }, [items])

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true

    const grid = GridStack.init({
      float: true,
      cellHeight: '30px',
      minRow: 1,
      margin: 5,
    })

    gridRef.current = grid

    const renderReact = (el: Element) => {
      let root = reactRoots.get(el)
      if (!root) {
        root = createRoot(el)
        reactRoots.set(el, root)
      }
    }

    grid.engine.nodes.forEach((node) => {
      const item = node.el!
      const contentEl = item.querySelector('.grid-stack-item-content')!
      renderReact(contentEl)
    })

    addNewWidget()

    return () => {
      grid.destroy(false)
      gridRef.current = null
    }
  }, [addNewWidget])

  return (
    <div>
      <section className='grid-stack' />
    </div>
  )
}
