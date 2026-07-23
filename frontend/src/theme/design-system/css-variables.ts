import { dsColorPalette } from './tokens/colors'
import { dsTypography } from './tokens/typography'
import { dsBorderRadius } from './tokens/borderRadius'
import { dsShadows } from './tokens/shadows'
import { dsAnimationDuration } from './tokens/animation'
import { dsSpacing } from './tokens/spacing'
import { dsZIndex } from './tokens/zIndex'
import { dsBreakpoints } from './tokens/breakpoints'

// Centralized CSS variables map for runtime consumption.
// These strings are intended to be used in a CSS :root style layer.
export const dsCssVariables = {
  '--font-sans': dsTypography.fontFamily.body,

  // Colors (core)
  '--color-bg': dsColorPalette.neutral[50],
  '--color-surface': dsColorPalette.neutral[0],
  '--color-text': dsColorPalette.neutral[900],
  '--color-text-secondary': dsColorPalette.neutral[600],
  '--color-border': dsColorPalette.neutral[200],

  '--color-brand': dsColorPalette.blue[600],
  '--color-brand-hover': dsColorPalette.blue[700],

  '--color-danger': dsColorPalette.red[600],
  '--color-success': dsColorPalette.green[600],
  '--color-warning': dsColorPalette.amber[600],

  // Radius
  '--radius-none': dsBorderRadius.none,
  '--radius-sm': dsBorderRadius.sm,
  '--radius-md': dsBorderRadius.md,
  '--radius-lg': dsBorderRadius.lg,
  '--radius-xl': dsBorderRadius.xl,
  '--radius-full': dsBorderRadius.full,

  // Shadows
  '--shadow-none': dsShadows.none,
  '--shadow-sm': dsShadows.sm,
  '--shadow-md': dsShadows.md,
  '--shadow-lg': dsShadows.lg,
  '--shadow-xl': dsShadows.xl,
  '--shadow-focus': dsShadows.focus,

  // Spacing (subset)
  '--space-1': dsSpacing[1],
  '--space-2': dsSpacing[2],
  '--space-3': dsSpacing[3],
  '--space-4': dsSpacing[4],
  '--space-6': dsSpacing[6],
  '--space-8': dsSpacing[8],

  // Animation durations
  '--anim-faster': dsAnimationDuration.faster,
  '--anim-fast': dsAnimationDuration.fast,
  '--anim-normal': dsAnimationDuration.normal,
  '--anim-slow': dsAnimationDuration.slow,

  // Z-index
  '--z-base': String(dsZIndex.base),
  '--z-modal': String(dsZIndex.modal),
  '--z-toast': String(dsZIndex.toast),
  '--z-fullscreen': String(dsZIndex.fullscreen),

  // Breakpoints
  '--bp-sm': dsBreakpoints.sm,
  '--bp-md': dsBreakpoints.md,
  '--bp-lg': dsBreakpoints.lg,
  '--bp-xl': dsBreakpoints.xl,
  '--bp-2xl': dsBreakpoints['2xl'],
} as const

