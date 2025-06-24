/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
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
  TextInput,
  Platform,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../navigation/RootNavigation';
import CustomAlertDialog from '../../components/customAlertDialog/CustomAlertDialog';
import Footer from '../footer/Footer'; // Asegúrate de que esta ruta sea correcta
import { LinearGradient } from 'react-native-linear-gradient';
import { JSX } from 'react/jsx-runtime';

const { width } = Dimensions.get('window');
const CARD_MARGIN_HORIZONTAL = 10;
const CARD_MARGIN_VERTICAL = 15;
const NUM_COLUMNS = 3;
const CONTAINER_HORIZONTAL_PADDING = 20;
const CALCULATED_CARD_WIDTH =
  (width - (CONTAINER_HORIZONTAL_PADDING * 2) - (CARD_MARGIN_HORIZONTAL * (NUM_COLUMNS - 1))) / NUM_COLUMNS;
const BACKGROUND_IMAGE = require('../../assets/icons/pokedex.png');

// --- TYPE DEFINITIONS ---
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

interface PokemonListScreenProps { 
  selectedType?: string;
}
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

const PokeBallIcon = ({ size = 24 }: { size?: number }): JSX.Element => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: size / 20,
      borderColor: '#333',
      backgroundColor: '#E73B5B',
      overflow: 'hidden',
    }}>
      <View style={{
        width: size,
        height: size / 2,
        backgroundColor: '#E73B5B',
        position: 'absolute',
        top: 0,
        left: 0,
      }} />
      <View style={{
        width: size,
        height: size / 2,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
      }} />
      <View style={{
        width: size / 4,
        height: size / 4,
        borderRadius: size / 8,
        backgroundColor: '#FFFFFF',
        borderWidth: size / 20,
        borderColor: '#333',
        position: 'absolute',
        alignSelf: 'center',
        top: (size / 2) - (size / 8),
        zIndex: 1,
      }} />
    </View>
  </View>
);


export default function PokemonListScreen({ selectedType }: PokemonListScreenProps): JSX.Element {
  const insets = useSafeAreaInsets();

  const [allPokemons, setAllPokemons] = useState<PokemonListItemDisplay[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<PokemonListItemDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortById, setSortById] = useState<boolean>(true);

  const [isRecommendedPokemonModalVisible, setIsRecommendedPokemonModalVisible] = useState(false);
  const [recommendedPokemon, setRecommendedPokemon] = useState<{ name: string; id: number; imageUrl: string } | null>(null);


  const fetchAllPokemons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      const pokemonEntries = response.data.results;

      const pokemonDetailsPromises = pokemonEntries.map(async (entry: { name: string; url: string }) => {
        const detailResponse = await axios.get<PokemonDetailData>(entry.url);
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
      pokemonsWithDetails.sort((a, b) => a.id - b.id);
      setAllPokemons(pokemonsWithDetails);

      const randomId = Math.floor(Math.random() * 151) + 1;
      const randomPokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const randomPokemon = randomPokemonResponse.data;
      setRecommendedPokemon({
        name: randomPokemon.name,
        id: randomPokemon.id,
        imageUrl: randomPokemon.sprites?.other?.['official-artwork']?.front_default ||
                  randomPokemon.sprites?.front_default ||
                  'https://placehold.co/96x96/E0E0E0/999999?text=No+Img',
      });
      setTimeout(() => setIsRecommendedPokemonModalVisible(true), 1500);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error loading Pokémon list: ${err.response?.statusText || err.message}`);
      } else if (err instanceof Error) {
        setError(`An error occurred: ${err.message}.`);
      } else {
        setError('An unknown error occurred while loading the Pokémon list.');
      }
      console.error("Error fetching Pokemons:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPokemons();
  }, [fetchAllPokemons]);

  useEffect(() => {
    let currentList = [...allPokemons];

    if (selectedType && selectedType !== 'unknown') {
      currentList = currentList.filter(pokemon =>
        pokemon.types.some(typeSlot => typeSlot.type.name.toLowerCase() === selectedType.toLowerCase())
      );
    }

    if (searchTerm !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentList = currentList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        String(pokemon.id).includes(lowerCaseSearchTerm)
      );
    }

    if (sortById) {
      currentList.sort((a, b) => a.id - b.id);
    } else {
      currentList.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredPokemons(currentList);
  }, [searchTerm, allPokemons, selectedType, sortById]);


  const renderPokemonCard = useCallback(({ item }: { item: PokemonListItemDisplay }) => {
    const pokemonIdFormatted = item.id ? `#${String(item.id).padStart(3, '0')}` : '';

    return (
      <TouchableOpacity
        style={[styles.pokemonCardContainer, { backgroundColor: item.primaryTypeColor || '#666666' }]} // Dynamic background color
        onPress={() => {
          navigate('PokemonDetailScreen', {
              pokemonId: item.id,
              primaryColor: item.primaryTypeColor || '#666666',
              pokemonName: item.name,
          });
        }}
      >
        <View style={styles.pokemonCardContent}>
          <Text style={styles.pokemonId}>{pokemonIdFormatted}</Text>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.pokemonImage} />
          ) : (
            <View style={styles.pokemonImagePlaceholder}>
              <Text style={styles.pokemonImagePlaceholderText}>No Image</Text>
            </View>
          )}
          <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  if (loading) {
    return (
      <View style={[styles.fullScreen, styles.centeredContent]}>
        <ActivityIndicator size="large" color="#E73B5B" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.fullScreen, styles.centeredContent]}>
        <Text style={styles.errorText}>Oops! Something went wrong:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      resizeMode="cover"
      style={styles.fullScreen} // Use fullScreen style for ImageBackground
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']} // Dark overlay for readability
        style={styles.fullScreen} // Apply gradient over the entire background
      >
        <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 0) }]}>
          <View style={styles.headerContainer}>
            <PokeBallIcon size={30} />
            <Text style={styles.headerTitle}>Pokédex</Text>
            <TouchableOpacity
              style={styles.headerRightIcon}
              onPress={() => setSortById(prev => !prev)}
            >
              <Text style={styles.headerRightIconText}>{sortById ? '#' : 'AZ'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBarContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search"
              placeholderTextColor="#666666"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          {filteredPokemons.length === 0 ? (
            <View style={styles.emptyListContent}>
              <Text style={styles.subText}>No Pokémon found.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredPokemons}
              keyExtractor={(item) => String(item.id)}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.pokemonListContent} 
              renderItem={renderPokemonCard}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              bounces={false}
              alwaysBounceVertical={false}
            />
          )}
        </View>
        {recommendedPokemon && (
          <CustomAlertDialog
            isVisible={isRecommendedPokemonModalVisible}
            title="Pokémon Recommendation!"
            message={`Today's recommended Pokémon is ${recommendedPokemon.name.toUpperCase()} (ID: #${String(recommendedPokemon.id).padStart(3, '0')})!`}
            imageUrl={recommendedPokemon.imageUrl}
            imageAltText={`Image of ${recommendedPokemon.name}`}
            onClose={() => setIsRecommendedPokemonModalVisible(false)}
          />
        )}
      </LinearGradient>
      <Footer /> 
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1, // Will be within ImageBackground, so still flex: 1
    // background color should not be here, as ImageBackground handles it
  },
  headerContainer: {
    backgroundColor: '#bf4141',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: Platform.OS === 'ios' ? 120 : 100,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  headerRightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRightIconText: {
    fontSize: 24,
    color: '#E73B5B',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    left: CONTAINER_HORIZONTAL_PADDING,
    right: CONTAINER_HORIZONTAL_PADDING,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1,
  },
  searchIcon: {
    fontSize: 20,
    color: '#666666',
    marginRight: 10,
  },
  searchTextInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333333',
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
  loadingText: {
    color: '#fefefe',
    fontSize: 18,
    marginTop: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  pokemonListContent: {
    paddingTop: 80,
    paddingBottom: 100, 
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN_VERTICAL,
  },
  pokemonCardContainer: {
    width: CALCULATED_CARD_WIDTH,
    height: CALCULATED_CARD_WIDTH * 1.25,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    // Background color set dynamically in renderPokemonCard
    marginHorizontal: CARD_MARGIN_HORIZONTAL / 2,
  },
  pokemonCardContent: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pokemonId: {
    position: 'absolute',
    top: 5,
    right: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF', // Changed to white for better contrast on colored cards
  },
  pokemonImage: {
    width: '80%',
    height: '55%',
    resizeMode: 'contain',
    marginTop: 15,
  },
  pokemonImagePlaceholder: {
    width: '80%',
    height: '55%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  pokemonImagePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 5,
  },
});
