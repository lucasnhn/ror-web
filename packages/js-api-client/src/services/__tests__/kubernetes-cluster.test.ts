import { createKubernetesClusterService } from '../kubernetes-cluster'

const mockCluster: any = {
  kind: 'Cluster',
  apiVersion: 'v1',
  metadata: { name: 'test', namespace: 'default' },
  rormeta: {},
  kubernetescluster: {
    spec: {
      topology: {
        workers: {
          nodePools: [
            {
              name: 'pool1',
              replicas: 10,
              version: 'v1.27.3',
              provider: 'azure',
              machineClass: 'high-performance',
              metadata: { labels: {}, annotations: {} },
            },
            {
              name: 'pool2',
              replicas: 5,
              version: 'v1.27.3',
              provider: 'azure',
              machineClass: 'high-performance',
              metadata: { labels: {}, annotations: {} },
            },
          ],
        },
      },
    },
  },
}

describe('removeNodePool', () => {
  it('removes the correct node pool', async () => {
    const request = jest
      .fn()
      .mockResolvedValueOnce(mockCluster) // GET
      .mockResolvedValueOnce(mockCluster) // PUT

    const service = createKubernetesClusterService(request as any)
    await service.removeNodePool('test-id', 'pool1')

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        body: expect.objectContaining({
          kubernetescluster: expect.objectContaining({
            spec: expect.objectContaining({
              topology: expect.objectContaining({
                workers: expect.objectContaining({
                  nodePools: [
                    {
                      name: 'pool2',
                      replicas: 5,
                      version: 'v1.27.3',
                      provider: 'azure',
                      machineClass: 'high-performance',
                      metadata: expect.any(Object),
                    },
                  ],
                }),
              }),
            }),
          }),
        }),
      })
    )
  })
})

describe('createOrUpdateNodePools', () => {
  it('creates new node pools', async () => {
    const request = jest
      .fn()
      .mockResolvedValueOnce(mockCluster) // GET
      .mockResolvedValueOnce(mockCluster) // PUT

    const service = createKubernetesClusterService(request as any)
    await service.createOrUpdateNodePools('test-id', {
      name: 'pool2',
      machineClass: 'type1',
      autoscaling: { enabled: true },
    })

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        body: expect.objectContaining({
          kubernetescluster: expect.objectContaining({
            spec: expect.objectContaining({
              topology: expect.objectContaining({
                workers: expect.objectContaining({
                  nodePools: [
                    {
                      name: 'pool1',
                      replicas: 10,
                      version: 'v1.27.3',
                      provider: 'azure',
                      machineClass: 'high-performance',
                      metadata: expect.any(Object),
                    },
                    {
                      name: 'pool2',
                      replicas: 5,
                      version: 'v1.27.3',
                      provider: 'azure',
                      machineClass: 'type1',
                      autoscaling: { enabled: true },
                      metadata: expect.any(Object),
                    },
                  ],
                }),
              }),
            }),
          }),
        }),
      })
    )
  })
})
