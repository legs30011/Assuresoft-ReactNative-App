import React, { useState, useEffect, useCallback, JSX } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Footer from '../footer/Footer'; 
import CustomHeader from '../customHeader/CustomHeader'; 
import { navigate } from '../../navigation/RootNavigation';

interface Type {
  name: string;
  url: string;
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
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F366B9',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  dark: '#705848',
  unknown: '#68A090',
  shadow: '#666699',
};

const darkenColor = (hex: string, percent: number): string => {
  let f = parseInt(hex.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = 15;
const CALCULATED_CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - (CARD_MARGIN * (NUM_COLUMNS - 1))) / NUM_COLUMNS;


interface TypeDisplay {
  name: string;
  url: string;
  primaryColor: string;
  secondaryColor: string;
}

export function TypeChartScreen(): JSX.Element {
  const [types, setTypes] = useState<TypeDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ results: Type[] }>('https://pokeapi.co/api/v2/type/?limit=18'); 
      const filteredApiTypes = response.data.results.filter(
        (type) => type.name !== 'unknown' && type.name !== 'shadow'
      );

      const typesWithColors = filteredApiTypes.map((type) => {
        const typeName = type.name.toLowerCase();
        const primaryColor = POKEMON_TYPE_COLORS[typeName] || POKEMON_TYPE_COLORS.unknown;
        const secondaryColor = darkenColor(primaryColor, -0.2);
        return {
          ...type,
          primaryColor,
          secondaryColor,
        };
      });
      setTypes(typesWithColors);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = `Error fetching types: ${err.response?.statusText || err.message} (Status: ${err.response?.status || 'N/A'})`;
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred while fetching types.');
      }
      setTypes([]); 
    } finally {
      setLoading(false); 
    }
  }, []); 

  useEffect(() => {
    fetchTypes(); 
  }, [fetchTypes]); 

  const renderTypeItem = useCallback(({ item }: { item: TypeDisplay }): JSX.Element => (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={[item.primaryColor, item.secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <Text
          style={styles.cardText}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.8}
        >
          {item.name.toUpperCase().replace(/-/g, ' ')}
        </Text>
      </LinearGradient>
    </View>
  ), []);

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <CustomHeader title="Types" showBackButton={true} /> 

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#EEFF00" />
            <Text style={styles.loadingText}>Loading Types...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredContent}>
            <Text style={styles.errorText}>Oops! Something went wrong:</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.flatListWrapper}>
            <FlatList
              data={types}
              keyExtractor={(item) => item.name}
              renderItem={renderTypeItem}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                  <View style={styles.emptyListMessage}>
                      <Text style={styles.loadingText}>No types found.</Text>
                  </View>
              )}
            />
            <TouchableOpacity 
              style={styles.practiceButton}
              onPress={() => navigate('TypePracticeScreen')} 
            >
              <Text style={styles.practiceButtonText}>Practice Type Match-ups</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  contentContainer: { 
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyListMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  flatListWrapper: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: CALCULATED_CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    marginBottom: CARD_MARGIN,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardGradient: {
    borderRadius: 10,
    padding: 10,
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
  },
  practiceButton: {
    backgroundColor: '#3D5AFE',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20, 
    marginBottom: 100, 
    alignSelf: 'center', 
    width: '90%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
