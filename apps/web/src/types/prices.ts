export type SimplePrice = {
  id: string
  machineClass: string
  price: number
}

export type Price = {
  id: string
  provider: string
  machineClass: string
  cpu: number
  memory: number
  memoryBytes: number
  price: number
  from: string
  to: string
}
