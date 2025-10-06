import { Price } from '@/types/prices'

export function getPriceId(price: Price) {
  return price.id
}

export function getPriceProvider(price: Price) {
  return price.provider
}

export function getPriceMachineClass(price: Price) {
  return price.machineClass
}

export function getPriceCpu(price: Price) {
  return price.cpu
}

export function getPriceMemory(price: Price) {
  return price.memory
}

export function getPriceMemoryBytes(price: Price) {
  return price.memoryBytes
}

export function getPriceValue(price: Price) {
  return price.price
}

export function getPriceFrom(price: Price) {
  return price.from
}

export function getPriceTo(price: Price) {
  return price.to
}
