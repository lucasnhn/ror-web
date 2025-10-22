import type { Layouts } from 'react-grid-layout'

export const standardLayouts: Layouts = {
  lg: [
    { i: 'cpu', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'memory', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'configuration', x: 12, y: 0, w: 6, h: 5, minW: 4, minH: 5 },
    { i: 'info', x: 0, y: 4, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'networks', x: 12, y: 4, w: 12, h: 16, minW: 9, minH: 16 },
    { i: 'controlPanel', x: 24, y: 0, w: 6, h: 16, minW: 6, minH: 10 },
  ],
  md: [
    { i: 'cpu', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'memory', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 4 },
    { i: 'configuration', x: 12, y: 0, w: 6, h: 5, minW: 4, minH: 5 },
    { i: 'info', x: 0, y: 4, w: 8, h: 8, minW: 6, minH: 8 },
    { i: 'networks', x: 8, y: 4, w: 12, h: 16, minW: 9, minH: 16 },
    { i: 'controlPanel', x: 20, y: 0, w: 6, h: 16, minW: 6, minH: 10 },
  ],
  sm: [
    { i: 'cpu', x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4 },
    { i: 'memory', x: 4, y: 0, w: 4, h: 4, minW: 4, minH: 4 },
    { i: 'configuration', x: 8, y: 0, w: 4, h: 5, minW: 4, minH: 5 },
    { i: 'info', x: 0, y: 4, w: 12, h: 8, minW: 9, minH: 8 },
    { i: 'networks', x: 0, y: 12, w: 12, h: 16, minW: 9, minH: 16 },
    { i: 'controlPanel', x: 0, y: 28, w: 6, h: 16, minW: 6, minH: 10 },
  ],
  xs: [
    { i: 'cpu', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 4 },
    { i: 'memory', x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 4 },
    { i: 'configuration', x: 4, y: 0, w: 2, h: 5, minW: 2, minH: 5 },
    { i: 'info', x: 0, y: 4, w: 6, h: 8, minW: 4, minH: 8 },
    { i: 'networks', x: 0, y: 12, w: 6, h: 16, minW: 4, minH: 16 },
    { i: 'controlPanel', x: 0, y: 28, w: 6, h: 16, minW: 6, minH: 10 },
  ],
}
