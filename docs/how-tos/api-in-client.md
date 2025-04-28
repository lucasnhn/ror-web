[Back to README](README.md)

# How to - implement API call in js-api-client

GoDoc: https://pkg.go.dev/github.com/NorskHelsenett/ror@v1.1.2/pkg/rorresources#Resource
Example: We will implement an API call for a Node.

Resource (many more [here](https://pkg.go.dev/github.com/NorskHelsenett/ror@v1.1.2/pkg/rorresources#Resource), but chose smaller set)

```go
type Resource struct {
	rortypes.CommonResource `json:",inline" bson:",inline"`

	NodeResource  *rortypes.ResourceNode  `json:"node,omitempty" bson:"node,omitempty"`
	PodResource   *rortypes.ResourcePod   `json:"pod,omitempty" bson:"pod,omitempty"`
	RouteResource *rortypes.ResourceRoute `json:"route,omitempty" bson:"route,omitempty"`
	// contains filtered or unexported fields
}
```

- Things to note with `Resource` struct:
  - What is says in `json` are what will be outputted in the `json`object
  - `omitempty`is practically that the element is nullable. If an int value is 0, string value is "" or boolean value is false

## 1: Create model/schema/type

### 1.1: Create schema file

- Create schema file for Node (packages/js-api-client/src/schema/node.ts)
- Create and export an empty schema in the file
- We use [Zod](https://zod.dev/). Therefore, we need to import zod (z), and set node to be a zod object. We will soon fill this object. Object inside `NodeSchema` is called `node`becaues that is what it said in `Resource`.

```ts
import { z } from 'zod'
import { V2ResourceSchema } from './common'

export const NodeSchema = V2ResourceSchema.extend({
  node: z.object({}),
})
```

### 1.2: Check out NodeResource

- Check out NodeResource in GoDoc

```go
type ResourceNode struct {
	Spec   ResourceNodeSpec   `json:"spec"`
	Status ResourceNodeStatus `json:"status"`
}
```

- See that a Node consist of `ResourceNodeSpec` and `ResourceNodeStatus`. Add those to `node.ts`.

```ts
import { z } from 'zod'

const NodeSpecSchema = z.object({})

const NodeStatusSchema = z.object({})

export const NodeSchema = V2ResourceSchema.extend({
  node: z.object({
    spec: NodeSpecSchema,
    status: NodeStatucSchema,
  }),
})
```

### 1.3: Check out ResourceNodeSpec and ResourceNodeStatus

- Check out ResourceNodeSpec and ResourceNodeStatus in GoDoc

```go
type ResourceNodeSpec struct {
	PodCIDR    string                   `json:"podCIDR,omitempty"`
	PodCIDRs   []string                 `json:"podCIDRs,omitempty"`
	ProviderID string                   `json:"providerID,omitempty"`
	Taints     []ResourceNodeSpecTaints `json:"taints,omitempty"`
}

type ResourceNodeStatus struct {
	Addresses  []ResourceNodeStatusAddresses  `json:"addresses"`
	Capacity   ResourceNodeStatusCapacity     `json:"capacity"`
	Conditions []ResourceNodeStatusConditions `json:"conditions"`
	NodeInfo   ResourceNodeStatusNodeinfo     `json:"nodeInfo"`
}
```

- See that `ResourceNodeSpec`consists of string, array of strings and array of ResourceNodeSpecTaints, while ResourceNodeStatus consists of array of ResourceNodeStatusAddresses, ResourceNodeStatusCapacity, array of ResourceNodeStatusConditions and ResourceNodeStatusNodeinfo. We do not need to add a schema for string or array of strings. The elements that have omitempty gets `.optional`

```ts
import { z } from 'zod'

const NodeSpecTaint = z.object({})

const NodeStatusAddress = z.object({})

const NodeStatusCapacity = z.object({})

const NodeStatusCondition = z.object({})

const NodeSpecSchema = z.object({})

const NodeStatusSchema = z.object({
  podCIDR: z.string().optional,
  podCIDRs: z.array(z.string()).optional,
  providerID: z.string().optional,
  taints: z.array(NodeSpecTaint).optional,
})

const NodeStatusNodeInfo = z.object({
  addresses: z.array(NodeStatusAddress),
  capacity: NodeStatusCapacity,
  conditions: z.array(NodeStatusCondition),
  nodeInfo: ResourceNodeStatusNodeinfo,
})

export const NodeSchema = V2ResourceSchema.extend({
  node: z.object({
    spec: NodeSpecSchema,
    status: NodeStatucSchema,
  }),
})
```

### 1.4: Check out NodeSpecTaint, NodeStatusAddress, NodeStatusCapacity, NodeStatusCondition and NodeSpecSchema

- Check out NodeSpecTaint, NodeStatusAddress, NodeStatusCapacity, NodeStatusCondition and NodeSpecSchema in GoDoc

```go
type ResourceNodeSpecTaints struct {
	Effect string `json:"effect"`
	Key    string `json:"key"`
}

type ResourceNodeStatusAddresses struct {
	Address string `json:"address"`
	Type    string `json:"type"`
}

type ResourceNodeStatusCapacity struct {
	Cpu              string `json:"cpu"`
	EphemeralStorage string `json:"ephemeralStorage"`
	Memory           string `json:"memory"`
	Pods             string `json:"pods"`
}

type ResourceNodeStatusConditions struct {
	LastHeartbeatTime  string `json:"lastHeartbeatTime"`
	LastTransitionTime string `json:"lastTransitionTime"`
	Message            string `json:"message"`
	Reason             string `json:"reason"`
	Status             string `json:"status"`
	Type               string `json:"type"`
}

type ResourceNodeStatusNodeinfo struct {
	Architecture            string `json:"architecture"`
	BootID                  string `json:"bootID"`
	ContainerRuntimeVersion string `json:"containerRuntimeVersion"`
	KernelVersion           string `json:"kernelVersion"`
	KubeProxyVersion        string `json:"kubeProxyVersion"`
	KubeletVersion          string `json:"kubeletVersion"`
	MachineID               string `json:"machineID"`
	OperatingSystem         string `json:"operatingSystem"`
	OsImage                 string `json:"osImage"`
	SystemUUID              string `json:"systemUUID"`
}
```

- See that everything is strings, which means we don't have to define any more schemas, we can just fill out `node.ts`

```ts
import { z } from 'zod'

const NodeSpecTaint = z.object({
  effect: z.string(),
  key: z.string(),
})

const NodeStatusAddress = z.object({
  address: z.string(),
  type: z.string(),
})

const NodeStatusCapacity = z.object({
  cpu: z.string(),
  ephemeralStorage: z.string(),
  memory: z.string(),
  pods: z.string(),
})

const NodeStatusCondition = z.object({
  lastHeartbeatTime: z.string(),
  lastTransitionTime: z.string(),
  message: z.string(),
  reason: z.string(),
  status: z.string(),
  type: z.string(),
})

const NodeSpecSchema = z.object({
  architecture: z.string(),
  bootID: z.string(),
  containerRuntimeVersion: z.string(),
  kernelVersion: z.string(),
  kubeProxyVersion: z.string(),
  kubeletVersion: z.string(),
  machineID: z.string(),
  operatingSystem: z.string(),
  osImage: z.string(),
  systemUUID: z.string(),
})

const NodeStatusSchema = z.object({
  podCIDR: z.string().optional,
  podCIDRs: z.array(z.string()).optional,
  providerID: z.string().optional,
  taints: z.array(NodeSpecTaint).optional,
})

const NodeStatusNodeInfo = z.object({
  addresses: z.array(NodeStatusAddress),
  capacity: NodeStatusCapacity,
  conditions: z.array(NodeStatusCondition),
  nodeInfo: ResourceNodeStatusNodeinfo,
})

export const NodeSchema = V2ResourceSchema.extend({
  node: z.object({
    spec: NodeSpecSchema,
    status: NodeStatucSchema,
  }),
})
```

### 1.5: Create v2 response schema

- Add this line to the bottom of your file
  - `export const NodeResponseSchema = createV2ResourceResponseSchema(NodeSchema)`
- And update the import
  - `import { createV2ResourceResponseSchema, V2ResourceSchema } from './common'`

### 1.6: Add to entities.ts

- Add `NodeSchema` and `NodeResponseSchema`to `packages/js-api-client/src/types/entities.ts`

```ts
import { NodeSchema, NodeResponseSchema } from '../schemas/node'

export type Node = z.infer<typeof NodeSchema>
export type NodeResponse = z.infer<typeof NodeResponseSchema>
```

## 2: Create service

### 2.1: Define what API calls you want to make

- Define what API calls you want to make (examples: getById, getAll, getAllWithId)

### 2.2: Create service file

- Create `packages/js-api-client/src/services/nodes.ts`
- Define and export an empty service (name format should be `createFilenameService`).
  - The service should take a request as a parameter, which has some options, and return a promise

```ts
import type { RequestOptions } from '../core/request'

export const createNodesService = (
	request: (requestOptions: RequestOptions => Promise<unknown>)
) => ({

})
```

### 2.3: Define API calls

- Define empty API calls. They need to be async, because they are waiting for a Promise.

```ts
import type { RequestOptions } from '../core/request'

export const createNodesService = (
	request: (requestOptions: RequestOptions => Promise<unknown>)
) => ({
	list: async () => {

	},

	byId: async () => {

	},

	listByCluster: async () => {

	},
})
```

### 2.4: Implement API call

#### 2.4.1: list

- `list` takes the parameter of `otherParams: URLSearchParams`
- Add explanation after talking to Patrick.

```ts
import type { RequestOptions } from '../core/request'

export const createNodesService = (
	request: (requestOptions: RequestOptions => Promise<unknown>)
) => ({
	list: async (otherParams: URLSearchParams) => {
		const params = new URLSearchParams(otherParams)


	},

	byId: async () => {

	},

	listByCluster: async () => {

	},
})
```

### 2.5 Add service to `services`in `create-api-client`

- Add the service to the `services`object to make it available

```ts
/**
 * Create our different services
 */
const services = {
  kubernetesClusters: createKubernetesClusterService(request),
  users: createUsersService(request),
  ingresses: createIngressesService(request),
  nodes: createNodesService(request),
}
```
