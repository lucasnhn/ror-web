export const vmActionsColors: Record<string, 'red' | 'emerald' | 'gray' | 'orange' | 'blue'> = {
  powerOff: 'red',
  powerOn: 'emerald',
  undefined: 'gray',
  restart: 'orange',
  suspend: 'blue',
  delete: 'red',
}

export const vmCardColors: Record<string, 'red' | 'emerald' | 'gray'> = {
  poweredOff: 'red',
  poweredOn: 'emerald',
  undefined: 'gray',
}

export const vmCardPowerStatus: Record<string, [string, string]> = {
  poweredOff: ['bg-red-500', 'text-red-900'],
  poweredOn: ['bg-emerald-500', 'text-emerald-900'],
  undefined: ['bg-gray-300', 'text-gray-900'],
}

export const pillPowerStatusColors: Record<string, [string, string]> = {
  poweredOff: ['bg-red-700', 'text-red-300'],
  poweredOn: ['bg-emerald-700', 'text-emerald-300'],
  undefined: ['bg-gray-500', 'text-gray-300'],
}
