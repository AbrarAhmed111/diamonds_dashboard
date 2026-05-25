/** Typography scale from file/Typography.pdf (Inter Tight). */

export const typography = {
  fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif',
  weight: {
    regular: 400,
    medium: 500,
  },
  desktop: {
    h1: { size: 68, lineHeight: 80 },
    h2: { size: 34, lineHeight: 40 },
    h3: { size: 28, lineHeight: 32 },
    h4: { size: 22, lineHeight: 28 },
    body: { size: 17, lineHeight: 24 },
    small: { size: 14, lineHeight: 20 },
    caption: { size: 12, lineHeight: 16 },
    buttonLg: { size: 20, lineHeight: 24 },
    buttonSm: { size: 16, lineHeight: 24 },
  },
  mobile: {
    h1: { size: 34, lineHeight: 40 },
    h2: { size: 28, lineHeight: 32 },
    h3: { size: 22, lineHeight: 28 },
    h4: { size: 18, lineHeight: 24 },
    body: { size: 16, lineHeight: 24 },
    small: { size: 14, lineHeight: 20 },
    caption: { size: 12, lineHeight: 16 },
  },
  chart: {
    axis: 12,
    label: 12,
  },
  gauge: {
    label: 9,
    tick: 8,
  },
} as const;
