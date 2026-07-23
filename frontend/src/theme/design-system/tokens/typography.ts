export const dsTypography = {
  fontFamily: {
    body: 'var(--font-sans)',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12
    sm: '0.875rem', // 14
    md: '1rem', // 16
    lg: '1.125rem', // 18
    xl: '1.25rem', // 20
    '2xl': '1.5rem', // 24
    '3xl': '1.875rem', // 30
  },
  lineHeight: {
    xs: '1rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '1.75rem',
    xl: '1.875rem',
    '2xl': '2rem',
    '3xl': '2.25rem',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const

