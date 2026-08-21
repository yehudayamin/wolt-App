import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, CARD_SHADOW } from './Theme';

export const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    hero: {
      width: '100%',
      height: 200,
    },
    header: {
      backgroundColor: c.card,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
    },
    restaurantName: {
      fontSize: 26,
      fontWeight: '800',
      color: c.text,
      marginBottom: SPACING.sm,
    },
    infoText: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 4,
    },
    ownerButtons: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginTop: SPACING.md,
    },
    button: {
      backgroundColor: c.accent,
      borderRadius: RADIUS.button,
      paddingVertical: 10,
      paddingHorizontal: SPACING.md,
      alignItems: 'center',
    },
    buttonText: {
      color: c.buttonText,
      fontWeight: '700',
      fontSize: 14,
    },
    dangerButton: {
      borderWidth: 1.5,
      borderColor: c.danger,
      borderRadius: RADIUS.button,
      paddingVertical: 10,
      paddingHorizontal: SPACING.md,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: c.danger,
      fontWeight: '700',
      fontSize: 14,
    },
    menuList: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
    },
    menuHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: c.text,
    },
    emptyText: {
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: SPACING.lg,
    },
    errorText: {
      color: c.danger,
      padding: SPACING.lg,
    },
  });
