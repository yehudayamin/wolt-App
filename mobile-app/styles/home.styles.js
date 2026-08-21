/*
 * home.styles.js — styles for the Home screen
 */

import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, CARD_SHADOW } from './Theme';

export const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      padding: SPACING.md,
    },
    greeting: {
      fontSize: 26,
      fontWeight: '800',
      color: c.text,
      marginBottom: 2,
    },
    subGreeting: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: SPACING.md,
    },
    brand: {
      fontSize: 28,
      fontWeight: '800',
      color: c.accent,
      marginBottom: 12,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: SPACING.sm,
      ...CARD_SHADOW,
    },
    searchIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    searchPlaceholder: {
      color: c.textSecondary,
      fontSize: 15,
    },
    sectionTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: c.text,
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
    },
    horizontalCard: {
      width: 260,
      marginRight: SPACING.md,
    },
    button: {
      backgroundColor: c.accent,
      borderRadius: RADIUS.button,
      paddingVertical: 13,
      alignItems: 'center',
      marginBottom: SPACING.sm,
      ...CARD_SHADOW,
    },
    textButton: {
      color: c.buttonText,
      fontWeight: '700',
      fontSize: 15,
    },
  });
