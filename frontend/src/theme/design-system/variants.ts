import { dsColorPalette } from './tokens/colors'
import { dsBorderRadius } from './tokens/borderRadius'

// Component variants are semantic (Apple/HIG style) and designed to map to CSS variables.
// Actual className wiring is intentionally left to the UI layer implementation.

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'link'

export type InputVariant = 'default' | 'error'

export type CardVariant = 'default' | 'elevated'

export type ModalVariant = 'default' | 'sheet'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export const buttonVariants: Record<ButtonVariant, any> = {
  primary: {
    radius: dsBorderRadius.lg,
    bg: dsColorPalette.blue[600],
    bgHover: dsColorPalette.blue[700],
    text: '#ffffff',
  },
  secondary: {
    radius: dsBorderRadius.lg,
    bg: dsColorPalette.neutral[100],
    bgHover: dsColorPalette.neutral[200],
    text: dsColorPalette.neutral[900],
  },
  ghost: {
    radius: dsBorderRadius.lg,
    bg: 'transparent',
    border: dsColorPalette.neutral[200],
    text: dsColorPalette.neutral[900],
  },
  danger: {
    radius: dsBorderRadius.lg,
    bg: dsColorPalette.red[600],
    bgHover: '#b91c1c',
    text: '#ffffff',
  },
  link: {
    radius: '0px',
    bg: 'transparent',
    text: dsColorPalette.blue[700],
    underline: true,
  },
}

export const inputVariants: Record<InputVariant, any> = {
  default: {
    border: dsColorPalette.neutral[200],
    focus: dsColorPalette.blue[500],
  },
  error: {
    border: dsColorPalette.red[600],
    focus: dsColorPalette.red[600],
  },
}

export const cardVariants: Record<CardVariant, any> = {
  default: {
    border: dsColorPalette.neutral[200],
    bg: dsColorPalette.neutral[0],
    elevation: 'sm',
  },
  elevated: {
    border: dsColorPalette.neutral[200],
    bg: dsColorPalette.neutral[0],
    elevation: 'md',
  },
}

export const modalVariants: Record<ModalVariant, any> = {
  default: {
    radius: dsBorderRadius.xl,
    padding: 'var(--space-6)',
  },
  sheet: {
    radius: dsBorderRadius.xl,
    padding: 'var(--space-6)',
    position: 'bottom',
  },
}

export const toastVariants: Record<ToastVariant, any> = {
  success: { accent: dsColorPalette.green[600] },
  error: { accent: dsColorPalette.red[600] },
  warning: { accent: dsColorPalette.amber[600] },
  info: { accent: dsColorPalette.blue[600] },
}

