/*
 * register.styles.js — styles for the Register screen
*/

import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, CARD_SHADOW } from './Theme';

export function makeStyles(colors) {
    return StyleSheet.create({
        container: {
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: colors.bgSecondary,
            padding: SPACING.lg,
            paddingTop: 40
        },
        card: {
            backgroundColor: colors.card,
            borderRadius: 18,
            padding: SPACING.xl,
            width: '100%',
            maxWidth: 420,
            ...CARD_SHADOW
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.accent,
            textAlign: 'center',
            marginBottom: SPACING.xl
        },
        input: {
            backgroundColor: colors.inputBg,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: RADIUS.input,
            paddingHorizontal: 14,
            height: 48,
            fontSize: 16,
            marginBottom: SPACING.md
        },
        errorText: {
            color: colors.danger,
            fontSize: 13,
            marginBottom: SPACING.sm
        },
        successMessage: {
            color: colors.success,
            fontSize: 14,
            marginBottom: SPACING.sm,
            textAlign: 'center'
        },
        button: {
            backgroundColor: colors.accent,
            borderRadius: RADIUS.button,
            paddingVertical: 12,
            alignItems: 'center',
            marginBottom: SPACING.md
        },
        buttonText: {
            color: colors.buttonText,
            fontWeight: '600',
            fontSize: 16
        },
        roleButton: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: RADIUS.button,
            paddingVertical: 10,
            alignItems: 'center',
            marginHorizontal: SPACING.xs,
            backgroundColor: colors.inputBg
        },
        roleButtonText: {
            color: colors.text,
            fontWeight: '600',
            fontSize: 15
        },
        roleButtonActive: {
            backgroundColor: colors.accent,
            borderColor: colors.accent
        },
        linkContainer: {
            marginTop: SPACING.lg,
            textAlign: 'center',
            color: colors.textSecondary,
            fontSize: 14
        },
        link: {
            color: colors.accent,
            fontWeight: '600'
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 16,
            paddingHorizontal: 5,
            backgroundColor: colors.bgSecondary, 
            padding: 10,
            borderRadius: 8,
        },
        switchLabel: {
            fontSize: 16,
            color: colors.text || '#000',
            fontWeight: '600',
        }
    });
}