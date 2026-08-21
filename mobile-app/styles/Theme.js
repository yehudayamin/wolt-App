/*
 * Theme.js — shared design tokens (colors, spacing, fonts, shadows) for light & dark mode.
 * React Native has no CSS variables, so this file plays the role of the web's :root / body.dark.
 *
 * Usage:
 *   const { theme } = useContext(AppContext);
 *   const c = getColors(theme);
 *   ...style={{ backgroundColor: c.bg, color: c.text }}
 */

export const LIGHT = {
  bg: '#f5f6f8',
  bgSecondary: '#eceef1',
  text: '#11151a',
  textSecondary: '#6b7280',
  card: '#ffffff',
  border: '#e6e8eb',
  accent: '#009de0',
  accentSoft: '#e3f4fc',
  buttonText: '#ffffff',
  danger: '#e53935',
  success: '#43a047',
  inputBg: '#ffffff',
  overlay: 'rgba(0,0,0,0.5)',
};

export const DARK = {
  bg: '#15171b',
  bgSecondary: '#1f2226',
  text: '#f3f4f6',
  textSecondary: '#9aa0a6',
  card: '#222529',
  border: '#33373d',
  accent: '#1aa9e6',
  accentSoft: '#0f2f3d',
  buttonText: '#ffffff',
  danger: '#ef5350',
  success: '#66bb6a',
  inputBg: '#2a2e33',
  overlay: 'rgba(0,0,0,0.7)',
};

// order status badge colors (used by OrderCard)
export const STATUS_COLORS = {
  pending: { bg: '#FFF3CD', text: '#856404' },
  completed: { bg: '#D4EDDA', text: '#155724' },
  cancelled: { bg: '#F8D7DA', text: '#721C24' },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const RADIUS = { input: 10, button: 12, card: 16, pill: 20 };
export const FONTS = { regular: 'System' };

// soft card shadow (works on both iOS shadow* and Android elevation)
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export function getColors(theme) {
  return theme === 'dark' ? DARK : LIGHT;
}
