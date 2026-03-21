import React, {useEffect, useState} from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { fetchPokemonDetail,
          fetchPokemonSpecies,
          type PokemonDetailResponse,
          type PokemonSpeciesResponse } from '../../services/pokeapi';

// const MOCK_POKEMON_DETAIL = {
//   id: 25,
//   name: 'pikachu',
//   imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
//   types: ['electric'],
//   height: 4,
//   weight: 60,
//   stats: [
//     { name: 'hp', value: 35 },
//     { name: 'attack', value: 55 },
//     { name: 'defense', value: 40 },
//     { name: 'speed', value: 90 },
//   ],
//   description:
//     'Whenever Pikachu comes across something new, it blasts it with a jolt of electricity. If you come across a blackened berry, it is evidence that this Pokémon mistook the intensity of its charge.',
// };

// type PokemonDetailState = typeof MOCK_POKEMON_DETAIL;

/**
 * Componente que exibe os detalhes de um Pokémon.
 * Mostra informações como nome, tipos, imagem, descrição, altura, peso e estatísticas.
 * Por que é usada: Para fornecer uma visão detalhada de um Pokémon selecionado na lista.
 */
export default function PokemonDetailScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, 'PokemonDetail'>>();
  const { id } = route.params;

  const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getPokemonDescriptionFromSpecies(
  species: PokemonSpeciesResponse,
  ): string | null {
  const ptEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'pt-BR'
  );
  if (ptEntry) {
    return ptEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
  }
  const enEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en',
  );
  if (enEntry) {
    return enEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
  }
  return null;
}
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const controller = new AbortController();

        async function loadPokemon() {
        try {
          setIsLoading(true);
          setError(null);

          const [detail, species] = await Promise.all([
            fetchPokemonDetail(id, { signal: controller.signal }),
            fetchPokemonSpecies(id, { signal: controller.signal }),
          ]);

          setPokemon(detail);
          setDescription(getPokemonDescriptionFromSpecies(species));
          // Extrair apenas os sprites "padrão" (não shiny), e preferir ordem front -> female(if any) -> back
          const preferredKeys = [
            'front_default',
            'front_female',
            'back_default',
            'back_female',
          ];

          const collected: string[] = [];
          preferredKeys.forEach((k) => {
            // @ts-ignore - key may not exist on the typed sprites object
            const v = detail.sprites[k];
            if (v && typeof v === 'string') collected.push(v);
          });

          // fallback: if none of the preferred keys exist, use front_default if present
          if (collected.length === 0 && detail.sprites.front_default) {
            collected.push(detail.sprites.front_default);
          }

          const unique = Array.from(new Set(collected));
          setImages(unique);
          setCurrentImageIndex(0);

        } catch (e) {
          if ((e as Error).name !== 'AbortError') {
            setError('Erro ao carregar detalhes do Pokémon.');
          }
        } finally {
          setIsLoading(false);
        }
      }

      loadPokemon();
    }, 0);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando detalhes (simulado)...</Text>
      </View>
    );
  }


if (error || !pokemon) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, marginBottom: 16 }}>
          {error ?? 'Erro inesperado na simulação.'}
        </Text>
        <TouchableOpacity
          //onPress={() => navigation.goBack()}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: theme.colors.accent,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionText}>
        ID informado: {id}
      </Text>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
        </View>

        <View style={styles.typeContainer}>
          {pokemon.types.map(({type}) => (
            <View key={type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type.name}</Text>
            </View>
          ))}
        </View>

          {/* Gallery: central image with left/right arrows */}
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => setCurrentImageIndex((i) => (i - 1 + images.length) % (images.length || 1))}
              style={styles.arrowButton}
              disabled={images.length === 0}
            >
              <Text style={styles.arrowText}>&lt;</Text>
            </TouchableOpacity>

            {images.length > 0 ? (
              <Image source={{ uri: images[currentImageIndex] }} style={styles.image} />
            ) : (
              // fallback para compatibilidade com estrutura anterior
              pokemon.sprites.front_default ? (
                <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
              ) : null
            )}

            <TouchableOpacity
              onPress={() => setCurrentImageIndex((i) => (i + 1) % (images.length || 1))}
              style={styles.arrowButton}
              disabled={images.length === 0}
            >
              <Text style={styles.arrowText}>&gt;</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.sectionText}>{pokemon.description}</Text>
      </View> */}


        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.sectionText}>{description ?? 'Descrição não disponível.'}</Text>
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações básicas</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Altura</Text>
          <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Peso</Text>
          <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats base</Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
            <Text style={styles.statValue}>{stat.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

