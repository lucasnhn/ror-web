import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';

  /** Any additional classNames for customization */
  className?: string;
}

export function Button({ size = "medium", className, children, ...rest }: ButtonProps) {
  const classes = clsx(`ror-button ror-button--${size}`, className)
  return (
    <button className={classes} {...rest}>{children}</button>
  )
}
