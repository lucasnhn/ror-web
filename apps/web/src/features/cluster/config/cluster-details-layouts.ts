import type { Layouts } from 'react-grid-layout'

export const standardLayouts: Layouts = {
  lg: [
    { i: 'memory', x: 0, y: 0, w: 6, h: 8, minW: 5, minH: 8 },
    { i: 'tools', x: 6, y: 0, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'info', x: 12, y: 0, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'versions', x: 24, y: 0, w: 6, h: 8, minW: 5, minH: 7 },
    { i: 'observed', x: 30, y: 0, w: 6, h: 8, minW: 5, minH: 5 },
    { i: 'prices', x: 36, y: 0, w: 6, h: 8, minW: 5, minH: 4 },
  ],
  md: [
    { i: 'memory', x: 0, y: 0, w: 6, h: 8, minW: 5, minH: 8 },
    { i: 'tools', x: 6, y: 0, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'info', x: 12, y: 0, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'versions', x: 0, y: 8, w: 6, h: 8, minW: 4, minH: 7 },
    { i: 'observed', x: 6, y: 8, w: 6, h: 8, minW: 5, minH: 5 },
    { i: 'prices', x: 12, y: 8, w: 6, h: 8, minW: 4, minH: 4 },
  ],
  sm: [
    { i: 'memory', x: 0, y: 0, w: 6, h: 8, minW: 5, minH: 8 },
    { i: 'tools', x: 6, y: 0, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'info', x: 0, y: 8, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'versions', x: 0, y: 16, w: 6, h: 8, minW: 4, minH: 7 },
    { i: 'observed', x: 6, y: 16, w: 6, h: 8, minW: 4, minH: 5 },
    { i: 'prices', x: 0, y: 24, w: 6, h: 8, minW: 4, minH: 4 },
  ],
  xs: [
    { i: 'memory', x: 0, y: 0, w: 6, h: 8, minW: 4, minH: 8 },
    { i: 'tools', x: 0, y: 8, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'info', x: 0, y: 16, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'versions', x: 0, y: 24, w: 6, h: 8, minW: 4, minH: 7 },
    { i: 'observed', x: 0, y: 32, w: 6, h: 8, minW: 4, minH: 5 },
    { i: 'prices', x: 0, y: 40, w: 6, h: 8, minW: 4, minH: 4 },
  ],
}
