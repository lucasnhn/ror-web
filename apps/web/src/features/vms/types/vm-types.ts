export type VMCardData =
  | 'id'
  | 'hostName'
  | 'name'
  | 'powerState'
  | 'architecture'
  | 'family'
  | 'version'
  | 'toolVersion'
  | 'team'

export type VMColumnsData = VMCardData | 'disk-size' | 'memory' | 'sockets' | 'cpu'
