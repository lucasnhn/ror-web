import {clsx} from "clsx";
import type { ReactElement, ReactNode } from "react";
import { LayerLevel, MAX_LEVEL, MIN_LEVEL } from "./layer";

interface TileProps {
  /**
  * Layering level tokens - 0, 1, 2
  * @default 0
  */
  layer?: LayerLevel
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
  layer = 0,
  className,
  children,
  as
}: TileProps) {

  const value = Math.max(
    MIN_LEVEL,
    Math.min(layer, MAX_LEVEL)
  );

  const classes = clsx('r-tile',
    {
      'r-tile--01': value === 0,
      'r-tile--02': value === 1,
      'r-tile--03': value === 2,
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
