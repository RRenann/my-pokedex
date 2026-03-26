import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import { fetchPokemonListPage, type PokemonListItemUI as PokemonListItem } from '../../services/pokeapi';
import { LogOut } from 'lucide-react-native';

const PAGE_SIZE = 10;

/**
 * Componente que exibe a lista de Pokémons.
 * Carrega e renderiza uma lista de Pokémons com seus tipos e imagens, permitindo navegação para detalhes.
 * Por que é usada: Para apresentar a interface principal da Pokédex, listando os Pokémons disponíveis.
 */


const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};

export default function PokemonListScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonList'>>();

  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [ isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  
  async function loadInitial() {
    try {
      setError(null);
      setIsInitialLoading(true);
      const page = await fetchPokemonListPage(PAGE_SIZE, 0);
      setItems(page.items);
      setOffset(PAGE_SIZE);
      setHasNextPage(Boolean(page.next));
    } catch {
      setError('Falha ao carregar a lista de Pokémon.');
    } finally {
      setIsInitialLoading(false);
    }
  }

async function loadMore() {
    if (isLoadingMore || isInitialLoading || isRefreshing || !hasNextPage) return;
    try {
      setIsLoadingMore(true);
      const page = await fetchPokemonListPage(PAGE_SIZE, offset);
      setItems((prev) => [...prev, ...page.items]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasNextPage(Boolean(page.next));
    } catch {
      setError('Falha ao carregar mais Pokémon.');
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function refreshList() {
    try {
      setError(null);
      setIsRefreshing(true);
      const page = await fetchPokemonListPage(PAGE_SIZE, 0);
      setItems(page.items);
      setOffset(PAGE_SIZE);
      setHasNextPage(Boolean(page.next));
    } catch {
      setError('Falha ao atualizar a lista.');
    } finally {
      setIsRefreshing(false);
    }
  }
  
  useEffect(() => {
    loadInitial();
  }, []);

  /**
   * Função que lida com o logout do usuário.
   * Reseta a navegação para a tela de login.
   * Por que é usada: Para permitir que o usuário faça logout e retorne à tela de autenticação.
   */
  const handleLogout = () => {
    // Integração de autenticação será adicionada futuramente
    console.log('Saindo...');
    navigation.reset({
      index: 0,
      routes: [{name: "Login"}],
    })
  };

  /**
   * Função que renderiza um item da lista de Pokémons.
   * @param item O objeto do Pokémon contendo id, name, imageUrl e types.
   * Por que é usada: Para customizar a exibição de cada Pokémon na FlatList, incluindo toque para navegar aos detalhes.
   */
  const renderItem = ({ item }: { item: PokemonListItem }) => (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8} 
        onPress={() => navigation.navigate('PokemonDetail', { id: item.id})}
      >
      <View style={styles.cardLeft}>
        <Text style={styles.cardName}>{item.name}</Text>

    <View style={styles.typeContainer}>
    {item.types.map((type) => (
      <View 
      key={`${item.id}-${type}`}
      style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type]}]}>
        <Text style={styles.typeText}>{type}</Text>
      </View> 
    ))}
</View>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
    </TouchableOpacity>
  );

  if (isInitialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando lista (simulado)...</Text>
      </View>
    );
  }
  if (error && items.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, marginBottom: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.flex} >
        <Text style={styles.headerTitle}>Pokédex</Text>
        <TouchableOpacity style={styles.buttonSair} onPress={handleLogout}>
          <Text style={styles.buttonSairText}>
            <LogOut/>
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh = {refreshList}
        refreshing={isRefreshing}
        ListFooterComponent = {
          isLoadingMore ? (
            <View style = {{ paddingVertical: 16}}>
              <ActivityIndicator size="small" color={theme.colors.primary}/>
            </View>
          ) : null
        }
      />
    </View>
  );
};