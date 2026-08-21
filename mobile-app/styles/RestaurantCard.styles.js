/* RestaurantCard styles */

import { StyleSheet } from 'react-native';
import { CARD_SHADOW } from './Theme';

export const makeStyles = (c) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 18,
      marginBottom: 16,
      overflow: 'hidden',
      ...CARD_SHADOW,
    },
    imageWrap: {
      width: '100%',
      height: 170,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: c.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderEmoji: {
      fontSize: 52,
    },
    scrim: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    nameOnImage: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: '800',
    },
    info: {
      padding: 14,
    },
    description: {
      fontSize: 14,
      color: c.textSecondary,
    },
    address: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 6,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 10,
    },
    tag: {
      backgroundColor: c.accentSoft,
      borderRadius: 20,
      paddingHorizontal: 11,
      paddingVertical: 5,
    },
    tagText: {
      fontSize: 11.5,
      color: c.accent,
      fontWeight: '700',
    },
  });
