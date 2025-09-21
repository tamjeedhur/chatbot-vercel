import React from 'react'
import { Search } from 'lucide-react'

export function SearchBar (props: {
  variant?: string;
  background?: string;
  children?: React.ReactElement;
  placeholder?: string;
  borderRadius?: string | number;
  [x: string]: any;
}) {
  const {
    variant,
    background,
    children,
    placeholder,
    borderRadius,
    ...rest
  } = props

  return (
    <div className="relative w-full md:w-[200px]" {...rest}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 text-sm font-medium bg-muted text-foreground placeholder:text-muted-foreground border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        placeholder={placeholder || 'Search...'}
        style={{
          borderRadius: borderRadius ? (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) : undefined,
          backgroundColor: background || undefined
        }}
      />
    </div>
  )
}
