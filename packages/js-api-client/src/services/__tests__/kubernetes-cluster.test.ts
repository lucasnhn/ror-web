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
          nodePools: [{ name: 'pool1' }, { name: 'pool2' }],
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
                  nodePools: [{ name: 'pool2' }],
                }),
              }),
            }),
          }),
        }),
      })
    )
  })
})
