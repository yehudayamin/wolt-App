/*
 * login.styles.js — styles for the Login screen
 */

import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, CARD_SHADOW } from './Theme';

export function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bgSecondary,
      padding: SPACING.lg,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: SPACING.xl,
      width: '100%',
      maxWidth: 420,
      ...CARD_SHADOW,
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      color: colors.accent,
      textAlign: 'center',
      marginBottom: SPACING.xl,
    },
    input: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RADIUS.input,
      paddingHorizontal: 14,
      height: 50,
      fontSize: 16,
      marginBottom: SPACING.md,
    },
    errorText: {
      color: colors.danger,
      fontSize: 13,
      marginBottom: SPACING.sm,
    },
    button: {
      backgroundColor: colors.accent,
      borderRadius: RADIUS.button,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.buttonText,
      fontWeight: '700',
      fontSize: 16,
    },
    linkContainer: {
      marginTop: SPACING.lg,
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 14,
    },
    link: {
      color: colors.accent,
      fontWeight: '700',
    },
  });
}
