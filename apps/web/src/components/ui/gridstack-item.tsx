'use client'

import React from 'react'
import PropTypes from 'prop-types'

export interface GridStackItemProps {
  autoPosition?: boolean
  children?: React.ReactNode
  height?: number
  id: string
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
  onShouldUpdate?: () => boolean
  width?: number
  x?: number
  y?: number
}

export default class GridStackItem extends React.Component<GridStackItemProps> {
  static defaultProps = {
    onShouldUpdate: () => false,
  }

  static propTypes = {
    autoPosition: PropTypes.bool,
    children: PropTypes.node,
    height: PropTypes.number,
    id: PropTypes.string.isRequired,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    minWidth: PropTypes.number,
    onShouldUpdate: PropTypes.func,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }

  render() {
    return this.props.children
  }
}
