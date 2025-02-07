'use client';
import Link from "next/link";
import { ReactNode, useId, useState } from "react";
import clsxm from "@/utils/clsxm";

import s from './navigation-item.module.scss';
import { usePathname } from "next/navigation";

interface SubNavigationItem {
  label: string;
  href: string;
}

interface NavigationItemProps {
  label: string;
  href?: string;
  subNav?: SubNavigationItem[];
  icon?: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function NavigationItem({ label, href, icon, subNav, className, defaultOpen = false }: NavigationItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const subNavId = useId();
  const pathname = usePathname()

  const handleOnToggleClick = () => {
    setOpen(!open);
  }

  const ariaControlId = `sub-nav-${subNavId}`

  if (Array.isArray(subNav) && subNav.length > 0) {
    return (
      <li className={s.item}>
        <button
          aria-controls={ariaControlId}
          aria-expanded={open}
          className={s.menuSection}
          onClick={handleOnToggleClick}
        >
          {icon}
          <span className={s.label}>{label}</span>
          <svg
            aria-hidden="true"
            role="img"
             xmlns="http://www.w3.org/2000/svg"
             width="24"
             height="24"
             fill="none"
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="3"
             className={s.caret}
             viewBox="0 0 24 24"
           >
             <path d="m9 18 6-6-6-6"></path>
           </svg>
        </button>
        <ul className={s.subNav}>
          {subNav.map((item) => {
            const classes = clsxm(s.menuItem, {
              [s.active]: item.href === pathname,
            });
            return (
              <li key={item.href}>
                <Link href={item.href} className={classes}>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </li>
    )
  }

  if (!href) {
    throw new Error("href must be provided for a navigation item without children");
  }

  return (
    <li className={s.item}>
      <Link href={href} className={s.menuItem}>
        {icon}
        <span className={s.label}>{label}</span>
      </Link>
    </li>
  );
}
