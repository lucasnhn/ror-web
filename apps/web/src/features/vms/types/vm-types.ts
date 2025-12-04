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
  | 'lastBackup'

export type VMColumnsData = VMCardData | 'disk-size' | 'memory' | 'sockets' | 'cpu'
