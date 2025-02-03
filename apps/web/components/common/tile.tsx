import clsxm from "@/utils/clsxm";
import type { ReactElement, ReactNode } from "react";

interface TileProps {
  /**
  * Layering tokens - 1, 2, 3
  * @default 1
  */
  layer: 1 | 2 | 3;
  /**
  * Render the component by your element of choice
  * @example
  * <Tile as="footer">
  */
  as?: ReactElement["type"];
  /**
  * Additional classes
  */
  className?: string;
  /**
  * Content of the tile
  */
  children: ReactNode;
}

export function Tile({
  layer = 1,
  className,
  children,
  as
}: TileProps) {
  const classes = clsxm(
    {
      [`bg-(--r-layer-01)`]: layer === 1,
      [`bg-(--r-layer-02)`]: layer === 2,
      [`bg-(--r-layer-03)`]: layer === 3,
    },
    className,
  );
  const Element = as ?? "div"
  return (
    <Element className={classes}>
      {children}
    </Element>
  );
}
