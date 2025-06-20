import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../navigation/RootNavigation';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { RootStackParamList } from '../../types/navigation';
import Footer from '../../sections/footer/Footer'; // Importa el componente Footer

const { width } = Dimensions.get('window');

// --- LOCAL ASSETS (ASEGÚRATE DE QUE ESTAS RUTAS Y EXTENSIONES SON EXACTAS) ---
const BACKGROUND_IMAGE = require('../../assets/icons/pokedex.png');
const POKEMON_CARD_ICON_LOCAL = require('../../assets/icons/pokeball.webp');
const MOVES_CARD_ICON_LOCAL = require('../../assets/icons/fire.png');
const EVOLUTION_CARD_ICON_LOCAL = require('../../assets/icons/evolution.png');

// --- SEARCH/APP ICONS (AHORA SIN tintColor para estos, asumiendo que son imágenes precoloreadas) ---
const SEARCH_ICON_LOCAL = require('../../assets/trainers/rival.webp');
const MICROPHONE_ICON_LOCAL = require('../../assets/trainers/garyPokemon.webp'); 
const APP_LOGO_IMAGE_LOCAL = require('../../assets/icons/pokedex.png');
const NEW_HEADER_IMAGE = require('../../assets/trainers/pikachu.webp'); 

// --- PLACEHOLDER ICONS (reemplazar con tus activos 3D locales más tarde) ---
const TYPES_CARD_ICON_PLACEHOLDER = require('../../assets/trainers/rival.webp');


const menuItems = [
  {
    name: 'Pokémon',
    icon: POKEMON_CARD_ICON_LOCAL,
    screen: 'PokemonListScreen',
    colors: ['#000000', '#ef0000'],
  },
  {
    name: 'Moves',
    icon: MOVES_CARD_ICON_LOCAL,
    screen: 'MovesScreen',
    colors: ['#000000', '#ff7700'],
  },
  {
    name:'Evolution',
    icon: EVOLUTION_CARD_ICON_LOCAL,
    screen: 'EvolutionScreen',
    colors: ['#000000','#008977'],
  },
  {
    name: 'Types',
    icon: TYPES_CARD_ICON_PLACEHOLDER,
    screen: 'TypeChartScreen',
    colors: ['#000000', '#2C6D9E'],
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  const handleNavigation = (screenName: keyof RootStackParamList, params?: any) => {
    navigate(screenName, params);
  };

  const performUniversalSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoadingSearch(true);
    setShowSearchResults(true);
    setSearchResults([]);

    try {
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      const moveResponse = await fetch(`https://pokeapi.co/api/v2/move/${query.toLowerCase()}`);
      const abilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${query.toLowerCase()}`);
      const itemResponse = await fetch(`https://pokeapi.co/api/v2/item/${query.toLowerCase()}`);

      const results = [];

      if (pokemonResponse.ok) {
        const pokemonData = await pokemonResponse.json();
        results.push({ type: 'Pokemon', name: pokemonData.name, id: pokemonData.id });
      }
      if (moveResponse.ok) {
        const moveData = await moveResponse.json();
        results.push({ type: 'Move', name: moveData.name, id: moveData.id });
      }
      if (abilityResponse.ok) {
        const abilityData = await abilityResponse.json();
        results.push({ type: 'Ability', name: abilityData.name, id: abilityData.id });
      }
      if (itemResponse.ok) {
        const itemData = await itemResponse.json();
        results.push({ type: 'Item', name: itemData.name, id: itemData.id });
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search API error:', error);
      setSearchResults([{ type: 'Error', name: 'Failed to fetch results.' }]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchText(text);
  };

  const CardItem: React.FC<{ item: typeof menuItems[0]; index: number }> = ({ item, index }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const onPressIn = () => {
      scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
    };

    const onPressOut = () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    };

    const imageSource = typeof item.icon === 'string' ? { uri: item.icon } : item.icon;

    return (
      <TouchableOpacity
        onPress={() => handleNavigation(item.screen as keyof RootStackParamList, item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.menuCardBase}
        activeOpacity={1}
      >
        <Animated.View style={[styles.menuCardAnimatedWrapper, animatedStyle]}>
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.menuCardGradient}
          >
            <Image
              source={imageSource}
              style={styles.menuCardIcon}
            />
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.menuCardText}>{item.name}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.fullScreen}>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}
        >
          <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 0) }]}>
            {/* Top Bar - Simplified */}
            <View style={styles.topBar} />

            {/* "What are you looking for?" Section with new image */}
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>What are</Text>
              <View style={styles.greetingTitleRow}>
                <Text style={styles.greetingText}>you looking for?</Text>
                <Image
                  source={NEW_HEADER_IMAGE}
                  style={styles.newHeaderImage}
                  resizeMode="contain" // Changed to 'contain' for better fitting
                />
              </View>
              <Text style={styles.greetingSubtitle}>WELCOME TO POKEDEX</Text>
            </View>

            {/* Search Input Section */}
            <View style={styles.searchContainer}>
              <Image
                source={SEARCH_ICON_LOCAL}
                style={[styles.searchIcon, { tintColor: undefined }]} // Removed tintColor to display original colors
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search pokemons, items, abilities, e etc ."
                placeholderTextColor="#c3c3c3"
                value={searchText}
                onChangeText={handleSearchInputChange}
                onSubmitEditing={() => performUniversalSearch(searchText)}
              />
              <TouchableOpacity onPress={() => performUniversalSearch(searchText)}>
                <Image
                  source={MICROPHONE_ICON_LOCAL}
                  style={[styles.microphoneIcon, { tintColor: undefined }]} // Removed tintColor
                />
              </TouchableOpacity>
            </View>

            {/* Search Results Display Area */}
            {showSearchResults && (
              <View style={styles.searchResultsContainer}>
                {loadingSearch ? (
                  <ActivityIndicator size="small" color="#EEFF00" />
                ) : searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <Text key={idx} style={styles.searchResultText}>
                      {result.type}: {result.name} (ID: {result.id || 'N/A'})
                    </Text>
                  ))
                ) : (
                  <Text style={styles.searchResultText}>No results found for "{searchText}".</Text>
                )}
              </View>
            )}

            {/* Main Content Area with Scrollable Grid */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gridContainer}>
                {menuItems.map((item, index) => (
                  <CardItem key={index} item={item} index={index} />
                ))}
              </View>
              {/* Central Bottom Image/Logo */}
            </ScrollView>
          </View>
        </LinearGradient>
      </ImageBackground>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  topBar: {
    height: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  greetingSection: {
    marginBottom: 30,
  },
  greetingText: {
    paddingTop: 10,
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  greetingSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#858585',
    paddingTop: 10,
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  newHeaderImage: {
    width: 60,
    height: 60,
    marginLeft: 20,
    resizeMode:'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#615f5f',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
    // tintColor: '#AAAAAA', // Removed tintColor
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  microphoneIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 10,
    // tintColor: '#AAAAAA', // Removed tintColor
  },
  searchResultsContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    maxHeight: 150,
  },
  searchResultText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  menuCardBase: {
    borderRadius: 15,
    marginVertical: 8,
    width: (width - 20 * 2 - 16) / 2,
    height: (width - 20 * 2 - 16) / 2 * 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  menuCardAnimatedWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuCardGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    height: '100%',
  },
  menuCardIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  menuCardText: {
    width: '100%',
    fontSize: Platform.select({
      ios: 17,
      android: 15,
      default: 15,
    }),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 5,
    fontStyle: 'italic',
  },
  appLogoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  appLogo: {
    width: 150,
    height: 50,
  },
});
