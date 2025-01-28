import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <button {...rest}>{children}</button>
  )
}
