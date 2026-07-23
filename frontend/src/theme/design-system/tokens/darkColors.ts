import { dsColorPalette } from './colors'

export type DarkThemePalette = {
  surface: Record<0 | 1 | 2 | 3 | 4, string>
  text: {
    primary: string
    secondary: string
    tertiary: string
  }
  brand: {
    primary: string
    primaryStrong: string
  }
  border: {
    subtle: string
    default: string
  }
  background: {
    primary: string
  }
}

export const dsDarkThemePalette: DarkThemePalette = {
  // Lightly re-mapped neutrals for dark surfaces.
  surface: {
    0: '#0b1220',
    1: '#0f172a',
    2: '#111c34',
    3: '#182544',
    4: '#1f2f50',
  },
  text: {
    primary: '#e5e7eb',
    secondary: '#9ca3af',
    tertiary: '#6b7280',
  },
  brand: {
    primary: dsColorPalette.blue[400],
    primaryStrong: dsColorPalette.blue[500],
  },
  border: {
    subtle: '#24324e',
    default: '#2b3b5c',
  },
  background: {
    primary: '#0b1220',
  },
} as const


