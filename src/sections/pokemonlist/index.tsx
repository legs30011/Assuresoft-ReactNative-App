/* eslint-disable quotes */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { navigate, goBack } from '../../navigation/RootNavigation';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_MARGIN_HORIZONTAL_TYPE = 8;
const CARD_MARGIN_VERTICAL_TYPE = 15;
const NUM_COLUMNS_TYPE = 2;
const CONTAINER_HORIZONTAL_PADDING_TYPE = 15;

const CALCULATED_CARD_WIDTH_TYPE =
  (width - (CONTAINER_HORIZONTAL_PADDING_TYPE * 2) - (CARD_MARGIN_HORIZONTAL_TYPE * (NUM_COLUMNS_TYPE - 1))) / NUM_COLUMNS_TYPE;
interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonAbilitySlot {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
}

interface PokemonListItemDisplay extends PokemonDetailData {
  imageUrl?: string;
  primaryTypeColor?: string;
}

interface PokemonTypeApiResult {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

interface PokemonTypeData {
  id: number;
  name: string;
  pokemon: PokemonTypeApiResult[];
}

type PokemonListScreenRouteProp = RouteProp<RootStackParamList, 'PokemonListScreen'>;

const POKEMON_TYPE_COLORS: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#FD7D24',
  water: '#4592C4',
  grass: '#9BCC50',
  electric: '#F7D02C',
  ice: '#51C4E7',
  fighting: '#D56723',
  poison: '#B97FC9',
  ground: '#F7DE3F',
  flying: '#3DC7EF',
  psychic: '#F366B9',
  bug: '#729F3F',
  rock: '#A38C21',
  ghost: '#7B62A3',
  dragon: '#53A4CF',
  steel: '#9EB7B8',
  fairy: '#FDB9EA',
  dark: '#707070',
};

export default function PokemonListScreen() {
  const insets = useSafeAreaInsets();

  const route = useRoute<PokemonListScreenRouteProp>();
  const type = route.params?.type || 'unknown';
  const [pokemons, setPokemons] = useState<PokemonListItemDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPokemonsByType = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const typeResponse = await axios.get<PokemonTypeData>(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonEntries = typeResponse.data.pokemon;
      const pokemonDetailsPromises = pokemonEntries.map(async (entry) => {
        const detailResponse = await axios.get<PokemonDetailData>(entry.pokemon.url);
        const primaryType = detailResponse.data.types[0]?.type.name.toLowerCase();
        const primaryColor = primaryType ? POKEMON_TYPE_COLORS[primaryType] : '#666666';
        return {
          ...detailResponse.data,
          imageUrl: detailResponse.data.sprites?.other?.['official-artwork']?.front_default ||
                    detailResponse.data.sprites?.front_default ||
                    undefined,
          primaryTypeColor: primaryColor,
        };
      });
      let pokemonsWithDetails = await Promise.all(pokemonDetailsPromises);
      pokemonsWithDetails.sort((a, b) => a.name.localeCompare(b.name));
      setPokemons(pokemonsWithDetails);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error al cargar Pokémon de tipo ${type}: ${err.response?.statusText || err.message}`);
      } else if (err instanceof Error) {
        setError(`Ocurrió un error: ${err.message}.`);
      } else {
        setError('Ocurrió un error desconocido al cargar los Pokémon.');
      }
      console.error("Error fetching Pokémon by type:", err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchPokemonsByType();
  }, [fetchPokemonsByType]);

  const renderPokemonCard = useCallback(({ item }: { item: PokemonListItemDisplay }) => {
    const gradientColors = [
      item.primaryTypeColor || '#666666',
      '#1a1a1a',
    ];
    const pokemonIdFormatted = item.id ? `#${String(item.id).padStart(3, '0')}` : '';

    return (
      <TouchableOpacity
        style={styles.pokemonCardContainer}
        onPress={() => {
          console.log("Pressed Pokemon (Type List):", item.name, "ID:", item.id, "Color:", item.primaryTypeColor);
          if (item.id) {
            navigate('PokemonDetailScreen', {
                pokemonId: item.id,
                primaryColor: item.primaryTypeColor,
                pokemonName: item.name});
          } else {
            console.warn("Cannot navigate: Pokemon ID is undefined for", item.name);
          }
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pokemonCardGradient}
        >
          <View style={[styles.pokemonBgCircle, { borderColor: item.primaryTypeColor || '#666666' }]} />
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.pokemonImage} />
          ) : (
            <View style={styles.pokemonImagePlaceholder}>
              <Text style={styles.pokemonImagePlaceholderText}>No Image</Text>
            </View>
          )}
          <Text style={styles.pokemonId}>{pokemonIdFormatted}</Text>
          <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
          <View style={styles.typeBadgesContainer}>
            {item.types.map((typeSlot, idx) => (
              <Text
                key={idx}
                style={[
                  styles.typeBadge,
                  { backgroundColor: POKEMON_TYPE_COLORS[typeSlot.type.name.toLowerCase()] || '#666666' },
                ]}
              >
                {typeSlot.type.name.toUpperCase()}
              </Text>
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, []);
  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContent, { paddingTop: insets.top + 20 }]}>
        <ActivityIndicator size="large" color="#eeff00" />
        <Text style={styles.loadingText}>Cargando Pokémon de tipo {type.toUpperCase()}...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, styles.centeredContent, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.errorText}>¡Ups! Algo salió mal:</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.headerText}>Pokémon de Tipo: {type.toUpperCase()}</Text>
      {pokemons.length === 0 ? (
        <View style={styles.emptyListContent}>
          <Text style={styles.subText}>No se encontraron Pokémon de este tipo.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => goBack()}
          >
            <Text style={styles.backButtonText}>Volver al Menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item) => String(item.id)}
          numColumns={NUM_COLUMNS_TYPE}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.pokemonListContent}
          renderItem={renderPokemonCard}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
        />
      )}
      {!loading && !error && pokemons.length > 0 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => goBack()}
        >
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: CONTAINER_HORIZONTAL_PADDING_TYPE,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontFamily: 'Inter-Bold',
  },
  subText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  loadingText: {
    color: '#eeff00',
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  pokemonListContent: {
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN_VERTICAL_TYPE,
  },
  pokemonCardContainer: {
    width: CALCULATED_CARD_WIDTH_TYPE,
    borderRadius: 15,
    overflow: 'hidden',
    aspectRatio: 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    marginHorizontal: CARD_MARGIN_HORIZONTAL_TYPE / 2,
  },
  pokemonCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonBgCircle: {
    position: 'absolute',
    top: 5,
    right: -25,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    opacity: 0.1,
    zIndex: 0,
  },
  pokemonId: {
    position: 'absolute',
    top: 10,
    right: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Inter-Bold',
  },
  pokemonImage: {
    width: '90%',
    height: '60%',
    resizeMode: 'contain',
    zIndex: 1,
    marginBottom: 5,
  },
  pokemonImagePlaceholder: {
    width: '90%',
    height: '60%',
    backgroundColor: '#666666',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pokemonImagePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  typeBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  typeBadge: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginHorizontal: 3,
    marginBottom: 5,
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#eeff00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 9,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#040404',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
});
