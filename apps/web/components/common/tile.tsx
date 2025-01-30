import clsxm from "@/utils/clsxm";
import type { ReactNode } from "react";

interface TileProps {
  layer: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
}

export function Tile({
  layer = 1,
  className,
  children,
}: TileProps) {
  const classes = clsxm(
    {
      [`bg-(--layer-01)`]: layer === 1,
      [`bg-(--layer-02)`]: layer === 2,
      [`bg-(--layer-03)`]: layer === 3,
    },
    className,
  );
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
