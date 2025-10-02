import { Node } from '@ror/js-api-client'

interface ManagedFields {
  manager?: string | undefined
  operation?: string | undefined
  apiVersion?: string | undefined
  time?: string | undefined
  fieldsType?: string | undefined
  fieldsV1?: Record<string, string | number | boolean | null> | undefined
  subresource?: string | undefined
}

/**
 * Returns the kind of the given node.
 *
 * @param node - The node object from which to retrieve the kind.
 * @returns The kind of the node as a string.
 */
export const getNodeKind = (node: Node): string => node.kind

/**
 * Retrieves the API version from the given Node object.
 *
 * @param node - The Node object from which to extract the API version.
 * @returns The API version string of the provided node.
 */
export const getNodeApiVersion = (node: Node): string => node.apiVersion

/**
 * Retrieves the name of a given node from its metadata.
 *
 * @param node - The node object from which to extract the name.
 * @returns The name of the node if available; otherwise, an empty string.
 */
export const getNodeName = (node: Node): string => node.metadata.name ?? ''

/**
 * Retrieves the unique identifier (UID) from the metadata of a given Node object.
 *
 * @param node - The Node object from which to extract the UID.
 * @returns The UID string if present; otherwise, an empty string.
 */
export const getNodeUid = (node: Node): string => node.metadata.uid ?? ''

/**
 * Retrieves the resource version string from a given Node object's metadata.
 *
 * @param node - The Node object from which to extract the resource version.
 * @returns The resource version as a string, or an empty string if not available.
 */
export const getNodeResourceVersion = (node: Node): string => node.metadata.resourceVersion ?? ''

/**
 * Retrieves the creation timestamp from a given Node object's metadata.
 *
 * @param node - The Node object from which to extract the creation timestamp.
 * @returns The creation timestamp as a string, or an empty string if not available.
 */
export const getNodeCreationTimestamp = (node: Node): string => node.metadata.creationTimestamp ?? ''

/**
 * Retrieves the labels from a given Node's metadata.
 *
 * @param node - The Node object from which to extract labels.
 * @returns An object containing the node's labels as key-value pairs.
 *          Returns an empty object if no labels are present.
 */
export const getNodeLabels = (node: Node): Record<string, string> => node.metadata.labels ?? {}

/**
 * Retrieves the annotations from a given Node object's metadata.
 *
 * @param node - The Node object from which to extract annotations.
 * @returns A record containing the annotation key-value pairs, or an empty object if no annotations are present.
 */
export const getNodeAnnotations = (node: Node): Record<string, string> => node.metadata.annotations ?? {}

/**
 * Retrieves the managed fields from a given Node's metadata.
 *
 * @param node - The Node object from which to extract managed fields.
 * @returns An array of managed fields if present; otherwise, an empty array.
 */
export const getNodeManagedFields = (node: Node): ManagedFields[] => node.metadata.managedFields ?? []

/**
 * Retrieves the version string from a given Node object's `rormeta` property.
 *
 * @param node - The Node object from which to extract the version.
 * @returns The version string if available; otherwise, an empty string.
 */
export const getNodeVersion = (node: Node): string => node.rormeta.version ?? ''

/**
 * Retrieves the hash value from the `rormeta` property of a given `Node` object.
 *
 * @param node - The `Node` object from which to extract the hash.
 * @returns The hash string if present; otherwise, an empty string.
 */
export const getNodeHash = (node: Node): string => node.rormeta.hash ?? ''

/**
 * Retrieves the owner reference of a given node.
 *
 * @param node - The node object from which to extract the owner reference.
 * @returns An object containing the `scope` and `subject` of the owner reference.
 *          If the owner reference is not present, returns an object with empty strings for both fields.
 */
export const getNodeOwnerRef = (node: Node): { scope: string; subject: string } =>
  node.rormeta.ownerref ?? { scope: '', subject: '' }

/**
 * Retrieves the action property from the `rormeta` field of a given `Node` object.
 *
 * @param node - The node object from which to extract the action.
 * @returns The action string if present; otherwise, an empty string.
 */
export const getNodeAction = (node: Node): string => node.rormeta.action ?? ''

/**
 * Retrieves the CPU capacity of a given node as a string.
 *
 * @param node - The node object from which to extract the CPU capacity.
 * @returns The CPU capacity of the node, or an empty string if not available.
 */
export const getNodeCpu = (node: Node): string => node.node.status?.capacity?.cpu ?? ''

/**
 * Retrieves the ephemeral storage capacity of a given node.
 *
 * @param node - The node object from which to extract the ephemeral storage capacity.
 * @returns The ephemeral storage capacity as a string, or an empty string if not available.
 */
export const getNodeEphemeralStorage = (node: Node): string => node.node.status?.capacity?.ephemeralStorage ?? ''

/**
 * Retrieves the memory capacity of a given node as a string.
 *
 * @param node - The node object from which to extract the memory capacity.
 * @returns The memory capacity of the node if available, otherwise an empty string.
 */
export const getNodeMemory = (node: Node): string => node.node.status?.capacity?.memory ?? ''

/**
 * Retrieves the pod capacity of a given node.
 *
 * @param node - The node object from which to extract the pod capacity.
 * @returns The number of pods the node can support as a string, or an empty string if unavailable.
 */
export const getNodePods = (node: Node): string => node.node.status?.capacity?.pods ?? ''

// TODO: export const getNodeConditions

/**
 * Retrieves the architecture information from a given Node object.
 *
 * @param node - The Node object from which to extract the architecture.
 * @returns The architecture string if available; otherwise, an empty string.
 */
export const getNodeArchitecture = (node: Node): string => node.node.status?.nodeInfo?.architecture ?? ''

/**
 * Retrieves the boot ID of a given node.
 *
 * @param node - The node object from which to extract the boot ID.
 * @returns The boot ID as a string, or an empty string if not available.
 */
export const getNodeBootID = (node: Node): string => node.node.status?.nodeInfo?.bootID ?? ''

/**
 * Retrieves the container runtime version from a given Node object.
 *
 * @param node - The Node object from which to extract the container runtime version.
 * @returns The container runtime version as a string, or an empty string if unavailable.
 */
export const getNodeContainerRuntimeVersion = (node: Node): string =>
  node.node.status?.nodeInfo?.containerRuntimeVersion ?? ''

/**
 * Retrieves the kernel version from the given Node object.
 *
 * @param node - The Node object from which to extract the kernel version.
 * @returns The kernel version as a string, or an empty string if unavailable.
 */
export const getNodeKernelVersion = (node: Node): string => node.node.status?.nodeInfo?.kernelVersion ?? ''

/**
 * Retrieves the kube-proxy version from the given Kubernetes node object.
 *
 * @param node - The Kubernetes node object from which to extract the kube-proxy version.
 * @returns The kube-proxy version as a string, or an empty string if not available.
 */
export const getNodeKubeProxyVersion = (node: Node): string => node.node.status?.nodeInfo?.kubeProxyVersion ?? ''

/**
 * Retrieves the kubelet version from the given Kubernetes node object.
 *
 * @param node - The Kubernetes node object from which to extract the kubelet version.
 * @returns The kubelet version as a string, or an empty string if not available.
 */
export const getNodeKubeletVersion = (node: Node): string => node.node.status?.nodeInfo?.kubeletVersion ?? ''

/**
 * Retrieves the machine ID from a given Node object.
 *
 * @param node - The Node object from which to extract the machine ID.
 * @returns The machine ID as a string, or an empty string if not available.
 */
export const getNodeMachineID = (node: Node): string => node.node.status?.nodeInfo?.machineID ?? ''

/**
 * Retrieves the operating system of a given node.
 *
 * @param node - The node object from which to extract the operating system information.
 * @returns The operating system as a string, or an empty string if not available.
 */
export const getNodeOperatingSystem = (node: Node): string => node.node.status?.nodeInfo?.operatingSystem ?? ''

/**
 * Retrieves the operating system image string from a given Node object.
 *
 * @param node - The Node object from which to extract the OS image information.
 * @returns The OS image string if available; otherwise, an empty string.
 */
export const getNodeOsImage = (node: Node): string => node.node.status?.nodeInfo?.osImage ?? ''

/**
 * Retrieves the system UUID from a given Node object.
 *
 * @param node - The Node object from which to extract the system UUID.
 * @returns The system UUID as a string, or an empty string if not available.
 */
export const getNodeSystemUUID = (node: Node): string => node.node.status?.nodeInfo?.systemUUID ?? ''
