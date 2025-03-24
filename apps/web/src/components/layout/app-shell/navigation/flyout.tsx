import { ReactNode } from 'react'

import s from './flyout.module.scss'

export function FlyoutMenu({ children }: { children: ReactNode }) {
  return <div className={s.flyoutMenu}>{children}</div>
}
