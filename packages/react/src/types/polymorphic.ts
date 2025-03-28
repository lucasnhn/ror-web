import type { ElementType, PropsWithChildren, ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react'

/**
 * Interface that adds an optional "as" prop to allow component polymorphism.
 *
 * @template C - The ElementType that can be used for the "as" prop
 */
interface AsProp<C extends ElementType> {
  as?: C
}

/**
 * Utility type to determine which props to omit when combining custom props with component props.
 * Ensures there are no conflicts between the component's native props and custom props.
 *
 * @template C - The ElementType of the component
 * @template P - The custom props object type
 */
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P)

/**
 * Creates a polymorphic component prop type without ref support.
 * This allows components to accept an "as" prop to change the underlying rendered element
 * while maintaining proper type checking for element-specific props.
 *
 * @template C - The ElementType that the component can render as (defaults to any HTML element type)
 * @template Props - Additional custom props for the component
 * @returns A type that combines children, custom props, the "as" prop, and the props of the specified element type
 */
export type PolymorphicComponentProp<C extends ElementType, Props = object> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

/**
 * Utility type to extract the correct ref type for a polymorphic component based on the element it renders.
 *
 * @template C - The ElementType that the component can render as
 * @returns The appropriate ref type for the specified element
 */
export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref']

/**
 * Creates a polymorphic component prop type with ref support.
 * Enhanced version of PolymorphicComponentProp that also handles the ref prop correctly.
 * Use this type when you need to forward refs in polymorphic components.
 *
 * @template C - The ElementType that the component can render as
 * @template Props - Additional custom props for the component
 * @returns A type that includes all polymorphic props plus proper ref typing
 */
export type PolymorphicComponentPropWithRef<C extends ElementType, Props = object> = PolymorphicComponentProp<
  C,
  Props
> & {
  ref?: PolymorphicRef<C>
}
