import { StyleSheet } from 'react-native';
import { CARD_SHADOW } from './Theme';

export const makeStyles = (c) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
      ...CARD_SHADOW,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: 12,
      marginRight: 12,
    },
    imagePlaceholder: {
      width: 72,
      height: 72,
      borderRadius: 12,
      marginRight: 12,
      backgroundColor: c.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700', color: c.text },
    description: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
    price: { fontSize: 15, fontWeight: '800', color: c.accent, marginTop: 6 },
    addBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    addBtnText: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: -2 },
    ownerRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    ownerBtn: {
      flex: 1,
      backgroundColor: c.accentSoft,
      borderRadius: 10,
      paddingVertical: 9,
      alignItems: 'center',
    },
    ownerBtnText: { color: c.accent, fontWeight: '700', fontSize: 13 },
    ownerBtnDanger: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: c.danger,
      borderRadius: 10,
      paddingVertical: 9,
      alignItems: 'center',
    },
    ownerBtnDangerText: { color: c.danger, fontWeight: '700', fontSize: 13 },
  });
