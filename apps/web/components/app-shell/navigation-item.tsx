'use client';
import Link from "next/link";
import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useId, useState } from "react";
import clsxm from "@/utils/clsxm";

import s from './navigation-item.module.scss';

interface NavigationItemProps {
  label: string;
  href?: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function NavigationItem({ label, href, icon, children, className, defaultOpen = true }: NavigationItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const subNavId = useId();
  const ariaControlId = `sub-nav-${subNavId}`
  const classes = clsxm(s.item, className);

  const handleOnToggleClick = () => {
    setOpen(!open);
  }

  if (children) {
    return (
      <li className={classes}>
        <button
          aria-controls={ariaControlId}
          aria-expanded={open}
          className={s.control}
          onClick={handleOnToggleClick}
        >
          <div className={s.controlInner}>
            {icon}
            <span>{label}</span>
          </div>
          <svg
             xmlns="http://www.w3.org/2000/svg"
             width="24"
             height="24"
             fill="none"
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="3"
             className={s.controlIcon}
             viewBox="0 0 24 24"
           >
             <path d="m9 18 6-6-6-6"></path>
           </svg>
        </button>
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child as ReactElement<HTMLUListElement>, {
              id: ariaControlId,
              className: clsxm(s.subMenuList, open ? s.open : s.closed)
            })
          }
          console.warn("NavigationItem received an unexpected element as a child")
          return child;
        })}
      </li>
    )
  }

  if (!href) {
    throw new Error("href must be provided for a navigation item without children");
  }

  return (
    <li className={classes}>
      <Link href={href} className={s.control}>
        <div className={s.controlInner}>
          {icon}
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
}
