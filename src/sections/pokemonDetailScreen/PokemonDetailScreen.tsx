/* eslint-disable dot-notation */
/* eslint-disable quotes */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { navigate, goBack } from '../../navigation/RootNavigation';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';


const { width } = Dimensions.get('window');

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

// --- TYPE DEFINITIONS ---
interface PokemonTypeSlot {
  slot: number;
  type: { name: string; url: string; };
}

interface PokemonAbilitySlot {
  ability: { name: string; url: string; };
  is_hidden: boolean;
  slot: number;
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string; };
}

interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string; };
  version: { name: string; url: string; };
}

interface GeneraEntry {
  genus: string;
  language: { name: string; url: string; };
}

interface PokemonSpeciesData {
  flavor_text_entries: FlavorTextEntry[];
  genera: GeneraEntry[];
  evolution_chain: { url: string };
}

interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
  stats: PokemonStat[];
  moves: Array<{ move: { name: string; url: string } }>;
}

interface PokemonDetailCombinedData extends PokemonDetailData {
  description: string;
  primaryTypeColor: string;
  genus: string;
}

interface EvolutionSpecies {
  name: string;
  url: string;
}

interface EvolutionDetail {
  min_level: number | null;
}

interface EvolvesTo {
  evolution_details: EvolutionDetail[];
  evolves_to: EvolvesTo[];
  species: EvolutionSpecies;
}

interface EvolutionChainData {
  baby_trigger_item: any;
  chain: {
    evolution_details: EvolutionDetail[];
    evolves_to: EvolvesTo[];
    species: EvolutionSpecies;
  };
  id: number;
}

interface EvolutionStageDisplay {
  id: number;
  name: string;
  imageUrl: string | undefined;
}

interface PokemonLocationArea {
  location_area: {
    name: string;
    url: string;
  };
  version_details: Array<{
    encounter_details: any[];
    max_chance: number;
    version: {
      name: string;
      url: string;
    };
  }>;
}

interface FormattedLocation {
  displayName: string;
  apiName: string;
}
type PokemonDetailScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetailScreen'>;

export default function PokemonDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<PokemonDetailScreenRouteProp>();

  const { pokemonId, primaryColor: initialPrimaryColor, pokemonName: initialPokemonName } = route.params || {};

  const [pokemonData, setPokemonData] = useState<PokemonDetailCombinedData | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionStageDisplay[]>([]);
  const [pokemonLocations, setPokemonLocations] = useState<FormattedLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'moves' | 'evolutions' | 'loc'>('about');

  const fetchEvolutionChain = useCallback(async (evolutionChainUrl: string) => {
    try {
      const response = await axios.get<EvolutionChainData>(evolutionChainUrl);
      const chain = response.data.chain;

      const evolutions: EvolutionStageDisplay[] = [];

      const parseChain = async (currentChain: EvolvesTo) => {
        const idMatch = currentChain.species.url.match(/\/(\d+)\/$/);
        const speciesId = idMatch ? parseInt(idMatch[1], 10) : null;

        if (speciesId) {
          try {
            const pokemonResponse = await axios.get<PokemonDetailData>(`https://pokeapi.co/api/v2/pokemon/${speciesId}`);
            const imageUrl = pokemonResponse.data.sprites?.other?.['official-artwork']?.front_default ||
                             pokemonResponse.data.sprites?.front_default ||
                             undefined;

            evolutions.push({
              id: speciesId,
              name: currentChain.species.name,
              imageUrl: imageUrl,
            });
          } catch (imgErr) {
            console.error(`Error fetching image for ${currentChain.species.name}:`, imgErr);
            evolutions.push({
              id: speciesId,
              name: currentChain.species.name,
              imageUrl: undefined,
            });
          }
        }

        for (const nextEvolution of currentChain.evolves_to) {
          await parseChain(nextEvolution);
        }
      };

      await parseChain(chain);
      setEvolutionChain(evolutions);
    } catch (err) {
      console.error("Error loading evolution chain:", err);
    }
  }, []);

  const fetchPokemonLocations = useCallback(async (id: number) => {
    try {
      const response = await axios.get<PokemonLocationArea[]>(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
      const locations = response.data.map(item => ({
        displayName: item.location_area.name.replace(/-/g, ' ').toUpperCase(),
        apiName: item.location_area.name,
      }));
      setPokemonLocations(locations);
    } catch (err) {
      console.error("Error loading locations:", err);
      setPokemonLocations([{ displayName: 'No locations found.', apiName: '' }]);
    }
  }, []);


  const fetchPokemonDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (typeof pokemonId === 'undefined' || pokemonId === null || typeof pokemonId !== 'number') {
      console.error("fetchPokemonDetails: pokemonId is undefined, null, or not a number. Cancelling fetch.");
      setError("Error: Invalid Pokémon ID.");
      setLoading(false);
      return;
    }

    try {
      const detailResponse = await axios.get<PokemonDetailData>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemonDetail = detailResponse.data;

      const speciesResponse = await axios.get<PokemonSpeciesData>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const speciesData = speciesResponse.data;

      const flavorTextEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      );
      const description = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ') : 'No description available.';

      const primaryType = pokemonDetail.types[0]?.type.name.toLowerCase();
      const resolvedPrimaryColor = initialPrimaryColor || (primaryType ? POKEMON_TYPE_COLORS[primaryType] : '#666666');

      const genusEntry = speciesData.genera?.find(
        (entry: GeneraEntry) => entry.language.name === 'en'
      );
      const genus = genusEntry ? genusEntry.genus : 'Pokémon';

      const fullPokemonData: PokemonDetailCombinedData = {
        ...pokemonDetail,
        description: description,
        primaryTypeColor: resolvedPrimaryColor,
        genus: genus,
      };
      setPokemonData(fullPokemonData);

      if (speciesData.evolution_chain?.url) {
        await fetchEvolutionChain(speciesData.evolution_chain.url);
      }
      await fetchPokemonLocations(pokemonId);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error loading Pokémon details: ${err.response?.statusText || err.message || "Network/Server Error"}`);
      } else if (err instanceof Error) {
        setError(`An error occurred: ${err.message}.`);
      } else {
        setError('An unknown error occurred while loading Pokémon details.');
      }
      console.error("Error fetching Pokémon details:", err);
    } finally {
      setLoading(false);
    }
  }, [pokemonId, initialPrimaryColor, fetchEvolutionChain, fetchPokemonLocations]);


  useEffect(() => {
    if (typeof pokemonId === 'number') {
      fetchPokemonDetails();
    } else {
      setError("Pokemon ID not provided or invalid for detail screen.");
      setLoading(false);
    }
  }, [fetchPokemonDetails, pokemonId]);

  if (typeof pokemonId === 'undefined' || pokemonId === null || typeof pokemonId !== 'number') {
      return (
          <View style={[styles.fullScreenLoadingContainer, { paddingTop: insets.top + 20 }]}>
              <Text style={styles.errorText}>Error: Pokémon ID not found or invalid. Please return to the list.</Text>
              <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
                  <Text style={styles.backButtonText}>Go Back</Text>
              </TouchableOpacity>
          </View>
      );
  }

  if (loading) {
    return (
      <View style={[styles.fullScreenLoadingContainer, { paddingTop: insets.top + 20 }]}>
        <ActivityIndicator size="large" color="#E73B5B" />
        <Text style={styles.loadingText}>Loading details for {initialPokemonName || `Pokémon #${pokemonId}`}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.fullScreenLoadingContainer, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.errorText}>Oops! Something went wrong:</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pokemonData) {
    return (
      <View style={[styles.fullScreenLoadingContainer, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.errorText}>No complete data found for this Pokémon. Please try again.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gradientColors = [
    pokemonData.primaryTypeColor,
    '#000000',
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContentSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutRow}>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Weight</Text>
                <Text style={styles.aboutValue}>{pokemonData.weight / 10} kg</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Height</Text>
                <Text style={styles.aboutValue}>{pokemonData.height / 10} m</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Abilities</Text>
                {pokemonData.abilities.map((abilitySlot, index) => (
                  <Text key={index} style={styles.aboutValue}>{abilitySlot.ability.name.replace('-', ' ')}</Text>
                ))}
              </View>
            </View>
            <Text style={styles.descriptionText}>{pokemonData.description}</Text>
          </View>
        );
      case 'stats':
        return (
          <View style={styles.tabContentSection}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            {pokemonData.stats.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>{stat.stat.name.toUpperCase().replace('SPECIAL-ATTACK', 'SP. ATK').replace('SPECIAL-DEFENSE', 'SP. DEF').replace('ATTACK', 'ATK').replace('DEFENSE', 'DEF').replace('HP', 'HP').replace('SPEED', 'SPD')}:</Text>
                <Text style={styles.statValue}>{String(stat.base_stat).padStart(3, '0')}</Text>
                <Progress.Bar
                  progress={stat.base_stat / 150}
                  width={width * 0.5}
                  color={pokemonData.primaryTypeColor}
                  unfilledColor="#333333"
                  borderWidth={0}
                  height={5}
                  borderRadius={5}
                  style={styles.progressBar}
                />
              </View>
            ))}
          </View>
        );
      case 'moves':
        return (
          <View style={styles.tabContentSection}>
            <Text style={styles.sectionTitle}>Moves</Text>
            <ScrollView style={styles.movesScrollView} showsVerticalScrollIndicator={false}>
              {pokemonData.moves && pokemonData.moves.length > 0 ? (
                pokemonData.moves.map((moveSlot, index) => (
                  <Text key={index} style={styles.moveText}>• {moveSlot.move.name.replace(/-/g, ' ').toUpperCase()}</Text>
                ))
              ) : (
                <Text style={styles.moveText}>No moves available.</Text>
              )}
            </ScrollView>
          </View>
        );
      case 'evolutions':
        return (
          <View style={styles.tabContentSection}>
            <Text style={styles.sectionTitle}>Evolutions</Text>
            {evolutionChain.length > 0 ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.evolutionContainer}
              >
                {evolutionChain.map((evo, index) => (
                  <View key={evo.id} style={styles.evolutionStage}>
                    <Image
                      source={{ uri: evo.imageUrl || 'https://placehold.co/96x96/E0E0E0/999999?text=No+Img' }}
                      style={styles.evolutionImage}
                    />
                    <Text style={styles.evolutionName}>{evo.name.toUpperCase()}</Text>
                    <Text style={styles.evolutionId}>#{String(evo.id).padStart(3, '0')}</Text>
                    {index < evolutionChain.length - 1 && (
                      <Text style={styles.evolutionArrow}>&#8594;</Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.subTextContent}>No evolution information found.</Text>
            )}
          </View>
        );
      case 'loc':
        return (
          <View style={styles.tabContentSection}>
            <Text style={styles.sectionTitle}>Locations</Text>
            {pokemonLocations.length > 0 && pokemonLocations[0].apiName !== '' ? (
              <ScrollView style={styles.locationsScrollView} showsVerticalScrollIndicator={false}>
                {pokemonLocations.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.locationItem}
                    onPress={() => navigate('LocationDetailScreen', { locationName: loc.apiName })}
                  >
                    <Text style={styles.locationText}>• {loc.displayName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.subTextContent}>No locations found for this Pokémon.</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };


  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 0) }]}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => goBack()} style={styles.backButtonHeader}>
            <Text style={styles.backButtonTextHeader}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.pokemonNameHeader}>{pokemonData.name.toUpperCase()}</Text>
          <Text style={styles.pokemonIdHeader}>#{String(pokemonData.id).padStart(3, '0')}</Text>
        </View>

        <View style={styles.pokemonImageContainer}>
          {pokemonData.sprites?.other?.['official-artwork']?.front_default ? (
            <Image
              source={{ uri: pokemonData.sprites['other']['official-artwork'].front_default }}
              style={styles.pokemonDetailImage}
            />
          ) : pokemonData.sprites?.front_default ? (
            <Image
              source={{ uri: pokemonData.sprites.front_default }}
              style={styles.pokemonDetailImage}
            />
          ) : (
            <View style={styles.pokemonImagePlaceholderDetail}>
              <Text style={styles.pokemonImagePlaceholderText}>No Image</Text>
            </View>
          )}
        </View>
        <Text style={styles.pokemonGenus}>{pokemonData.genus}</Text>


        <View style={styles.typeBadgesDetailContainer}>
          {pokemonData.types.map((typeSlot, idx) => (
            <Text
              key={idx}
              style={[
                styles.typeBadgeDetail,
                { backgroundColor: POKEMON_TYPE_COLORS[typeSlot.type.name.toLowerCase()] || '#666666' },
              ]}
            >
              {typeSlot.type.name.toUpperCase()}
            </Text>
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setActiveTab('about')} style={[styles.tabButton, activeTab === 'about' && styles.activeTabButton]}>
              <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('stats')} style={[styles.tabButton, activeTab === 'stats' && styles.activeTabButton]}>
              <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Stats</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('moves')} style={[styles.tabButton, activeTab === 'moves' && styles.activeTabButton]}>
              <Text style={[styles.tabText, activeTab === 'moves' && styles.activeTabText]}>Moves</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('evolutions')} style={[styles.tabButton, activeTab === 'evolutions' && styles.activeTabButton]}>
              <Text style={[styles.tabText, activeTab === 'evolutions' && styles.activeTabText]}>Evolutions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('loc')} style={[styles.tabButton, activeTab === 'loc' && styles.activeTabButton]}>
              <Text style={[styles.tabText, activeTab === 'loc' && styles.activeTabText]}>Loc</Text>
            </TouchableOpacity>
          </View>

          {renderTabContent()}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 50,
  },
  fullScreenLoadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
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
  backButton: {
    marginTop: 20,
    backgroundColor: '#E73B5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  detailHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    marginBottom: 0,
  },
  backButtonHeader: {
    padding: 10,
  },
  backButtonTextHeader: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pokemonNameHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Inter-Bold',
  },
  pokemonIdHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },

  pokemonImageContainer: {
    width: '100%',
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  pokemonDetailImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 2,
  },
  pokemonImagePlaceholderDetail: {
    width: '80%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonImagePlaceholderText: {
    color: '#999999',
    fontSize: 12,
  },
  pokemonGenus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  typeBadgesDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeBadgeDetail: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    fontFamily: 'Inter-SemiBold',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  infoCard: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginTop: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingTop: 10,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#eeff00',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCCCCC',
    fontFamily: 'Inter-Bold',
  },
  activeTabText: {
    color: '#eeff00',
  },
  tabContentSection: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  aboutItem: {
    alignItems: 'center',
    flex: 1,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 5,
    fontFamily: 'Inter-Regular',
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  descriptionText: {
    fontSize: 14,
    color: '#DDDDDD',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    width: 60,
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
  },
  statValue: {
    width: 40,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    marginRight: 10,
    fontFamily: 'Inter-Regular',
  },
  progressBar: {
    flex: 1,
  },
  movesScrollView: {
    maxHeight: 200,
  },
  moveText: {
    fontSize: 14,
    color: '#DDDDDD',
    marginBottom: 5,
    fontFamily: 'Inter-Regular',
  },
  subTextContent: {
    fontSize: 16,
    color: '#DDDDDD',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  evolutionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  evolutionStage: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 15,
    width: 100,
  },
  evolutionImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    backgroundColor: '#333333',
    borderRadius: 45,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    marginBottom: 5,
  },
  evolutionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  evolutionId: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  evolutionArrow: {
    fontSize: 30,
    color: '#FFFFFF',
    marginHorizontal: 5,
    position: 'absolute',
    right: -25,
    top: '30%',
    transform: [{ translateY: -15 }],
    zIndex: 1,
  },
  locationsScrollView: {
    maxHeight: 250,
    paddingHorizontal: 10,
  },
  locationItem: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  locationText: {
    fontSize: 16,
    color: '#DDDDDD',
    fontFamily: 'Inter-Regular',
  },
});
