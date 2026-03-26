import { StyleSheet } from 'react-native';
import type { Theme } from '../../global/themes';

/**
 * Função que cria os estilos da tela de lista de Pokémons.
 * @param theme O tema atual da aplicação.
 * Por que é usada: Para definir os estilos responsivos baseados no tema, garantindo consistência visual.
 */
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    listContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 12,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    cardLeft: {
      flex: 1,
      marginRight: 12,
    },
    cardName: {
      fontSize: 18,
      fontWeight: '700',
      textTransform: 'capitalize',
      marginBottom: 8,
      color: theme.colors.text,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    typeBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    typeText: {
      fontSize: 12,
      textTransform: 'capitalize',
      color: theme.colors.text,
    },
    cardImage: {
      width: 72,
      height: 72,
    },
    buttonSair: {
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'red',
      borderRadius: 40,
      borderWidth: 1,
      borderColor: theme.colors.primaryDark,
    },
    buttonSairText: {
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    flex: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 32,
    },
  });

  
