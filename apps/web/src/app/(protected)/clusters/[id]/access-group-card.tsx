import clsxm from '@/utils/clsxm'
import { Cluster } from '@ror/js-api-client'
import { Stack } from '@ror/react'
import { Layer } from '@ror/react/components/layer'
import { Tile } from '@ror/react/components/tile'
interface ClusterAccessGroupCardProps {
  cluster: Cluster
  className?: string
}

export function ClusterAccessGroupCard({ cluster, className }: ClusterAccessGroupCardProps) {

  const classes = clsxm('p-5', className)
  console.log("cluster", cluster)

  return (
    <Tile className={classes}>
      <h3 className='heading-01 pb-3 mb-5 border-b border-b-(--r-border-subtle)'>Access Groups</h3>
      <Layer level={1}>
        <Stack gap={5} className='max-w-full'>
            <ul className='list-disc list-inside '>
                {cluster.acl.accessGroups.map((group) => (
                    <li key={group} className='mb-3 last:mb-0' >{group}</li>
                ))}
            </ul>
        </Stack>
      </Layer>
    </Tile>
  )
}
