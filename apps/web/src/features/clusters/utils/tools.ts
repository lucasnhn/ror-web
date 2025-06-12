// import { KubernetesCluster } from '@ror/js-api-client'

// type ExtractToolHostnamesReturnType<T extends Record<string, string>> = {
//   [K in keyof T]: string | null
// }

/**
 * Extracts specific tool hostnames from cluster ingresses
 *
 * This function scans through a cluster's ingress rules and identifies hostnames
 * that match specific tool patterns. It's useful for discovering which tools are
 * exposed in a cluster and getting their hostnames.
 *
 * @param cluster - The cluster object containing ingresses data
 * @param toolPatterns - An object with keys as tool names and values as pattern strings to match against hostnames
 * @returns An object with tool names as keys and their corresponding hostnames (or null if not found)
 *
 * @example
 * // Basic usage
 * const cluster = {
 *   ingresses: [
 *     {
 *       ingressrules: [
 *         { hostname: 'grafana.example.com' },
 *         { hostname: 'prometheus.example.com' }
 *       ]
 *     }
 *   ]
 * };
 *
 * const toolPatterns = {
 *   grafana: 'grafana',
 *   prometheus: 'prometheus',
 *   kibana: 'kibana'
 * };
 *
 * const result = extractToolHostnames(cluster, toolPatterns);
 * // => { grafana: 'grafana.example.com', prometheus: 'prometheus.example.com', kibana: null }
 *
 * @example
 * // Using the result for navigation
 * const tools = extractToolHostnames(cluster, { grafana: 'grafana' });
 * if (tools.grafana) {
 *   window.open(`https://${tools.grafana}`, '_blank');
 * }
 *
 * @example
 * // Handling a cluster with no ingresses
 * const emptyCluster = {};
 * const result = extractToolHostnames(emptyCluster, { grafana: 'grafana' });
 * // => { grafana: null }
 *
 * @example
 * // Using with more specific patterns
 * const specificPatterns = {
 *   prodGrafana: 'grafana-prod',
 *   devGrafana: 'grafana-dev'
 * };
 * const result = extractToolHostnames(cluster, specificPatterns);
 */

// TODO: Implement with new KubernetesCluster type
// export function extractToolHostnames<T extends Record<string, string>>(
//   cluster: { ingresses?: KubernetesCluster['ingresses'] },
//   toolPatterns: T
// ): ExtractToolHostnamesReturnType<T> {
//   // Initialize result with all tools set to null
//   const result = Object.keys(toolPatterns).reduce(
//     (acc, tool) => ({ ...acc, [tool]: null }),
//     {}
//   ) as ExtractToolHostnamesReturnType<T>

//   if (!cluster.ingresses || !Array.isArray(cluster.ingresses)) {
//     return result
//   }

//   // Iterate through ingresses and rules to find matching hostnames
//   cluster.ingresses.forEach((ingress) => {
//     if (!ingress?.ingressrules || !Array.isArray(ingress.ingressrules)) {
//       return
//     }

//     ingress.ingressrules.forEach((rule) => {
//       if (!rule?.hostname) {
//         return
//       }

//       // Check each tool pattern against the hostname
//       Object.entries(toolPatterns).forEach(([tool, pattern]) => {
//         if (rule.hostname?.includes(pattern)) {
//           result[tool as keyof T] = rule.hostname
//         }
//       })
//     })
//   })

//   return result
// }

// export function getArgoTool(cluster: KubernetesCluster): string | null {
//   const tools = extractToolHostnames(cluster, { argo: 'argo' })
//   return tools.argo
// }

// export function getGrafanaTool(cluster: KubernetesCluster): string | null {
//   const tools = extractToolHostnames(cluster, { grafana: 'grafana' })
//   return tools.grafana
// }

export function getCommonClusterTools(cluster: KubernetesCluster) {
  return extractToolHostnames(cluster, { argo: 'argo', grafana: 'grafana' })
}
