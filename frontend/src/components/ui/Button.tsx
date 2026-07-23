import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button({
  children,
  ...props
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={props.type ?? 'button'} {...props}>
      {children}
    </button>
  )
}

