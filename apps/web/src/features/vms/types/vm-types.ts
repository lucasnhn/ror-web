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
  | 'activeBackup'

export type VMColumnsData = VMCardData | 'disk-usage' | 'memory' | 'sockets' | 'cpu'
