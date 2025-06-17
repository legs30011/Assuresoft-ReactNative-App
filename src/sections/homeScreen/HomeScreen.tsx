import React from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../navigation/RootNavigation';
import { RootStackParamList } from '../../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const POKEDEX_ICON = 'https://placehold.co/100x100/E73B5B/FFFFFF?text=P';
const MOVES_ICON = 'https://placehold.co/100x100/F7D02C/000000?text=M';
const ABILITIES_ICON = 'https://placehold.co/100x100/B97FC9/FFFFFF?text=A';
const ITEMS_ICON = 'https://placehold.co/100x100/9EB7B8/000000?text=I';
const PARTIES_ICON = 'https://placehold.co/100x100/4592C4/FFFFFF?text=P';
const LOCATIONS_ICON = 'https://placehold.co/100x100/9BCC50/FFFFFF?text=L';
const NATURES_ICON = 'https://placehold.co/100x100/D56723/FFFFFF?text=N';
const TYPE_CHART_ICON = 'https://placehold.co/100x100/707070/FFFFFF?text=T';

const BACKGROUND_PATTERN_SVG_CONTENT = '<svg width="100%" height="100%" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M9 2.5L8.5 3.1C7.7 4.8 6.3 7.5 6.8 8.2 7.5 8.7 9 6.8 9.6 6.6L10.2 5.6L9 2.5zM6 0.5L6 2.5 7 3.5 6.5 4.4 5 5 5 7.5 5 8.5 5.6 9.6 6.4 10.2 6.6 10.2 5.6 9.6 6.6 7.7 4.8 6.3 7.5 6.8 8.2 7.5 8.7 9 6.8 9.6 6.6 10.2 5.6 9 2.5 8.5 3.1 7.7 4.8 6.3 7.5 6.8 8.2 7.5 8.7 9 6.8 9.6 6.6 10.2 5.6 9 2.5 z" fill="#333333" opacity="0.08"/></svg>';
const BACKGROUND_PATTERN = `data:image/svg+xml;base64,${btoa(BACKGROUND_PATTERN_SVG_CONTENT)}`;

const menuItems = [
  {
    name: 'Pokédex',
    icon: POKEDEX_ICON,
    screen: 'PokemonListScreen',
    colors: ['#E73B5B', '#C2002E'],
  },
  {
    name: 'Moves',
    icon: MOVES_ICON,
    screen: 'MovesScreen',
    colors: ['#F7D02C', '#F3A800'],
  },
  {
    name: 'Abilities',
    icon: ABILITIES_ICON,
    screen: 'AbilitiesScreen',
    colors: ['#B97FC9', '#905A9C'],
  },
  {
    name: 'Items',
    icon: ITEMS_ICON,
    screen: 'ItemsScreen',
    colors: ['#9EB7B8', '#7E9C9E'],
  },
  {
    name: 'Parties',
    icon: PARTIES_ICON,
    screen: 'ComingSoonScreen',
    colors: ['#4592C4', '#2C6D9E'],
  },
  {
    name: 'Locations',
    icon: LOCATIONS_ICON,
    screen: 'LocationDetailScreen',
    params: { locationName: 'pallet-town' },
    colors: ['#9BCC50', '#7AA040'],
  },
  {
    name: 'Natures',
    icon: NATURES_ICON,
    screen: 'NaturesScreen',
    colors: ['#D56723', '#A84C1C'],
  },
  {
    name: 'Type Chart',
    icon: TYPE_CHART_ICON,
    screen: 'TypeChartScreen',
    colors: ['#707070', '#4A4A4A'],
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handlePress = (screenName: keyof RootStackParamList, params?: any) => {
    navigate(screenName, params);
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <ImageBackground
        source={{ uri: BACKGROUND_PATTERN }}
        resizeMode="repeat"
        style={styles.backgroundPattern}
      >
        <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 0) }]}>
          <Text style={styles.headerTitle}>AssureDex</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.gridContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuCardBase,
                    item.name === 'Pokédex' ? styles.pokedexCardLayout : styles.smallCardLayout,
                  ]}
                  onPress={() => handlePress(item.screen as keyof RootStackParamList, item.params)}
                >
                  <LinearGradient
                    colors={item.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.menuCardGradient}
                  >
                    <Image source={{ uri: item.icon }} style={styles.menuIcon} />
                    <Text style={styles.menuText}>{item.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.98,
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Platform.select({
      ios: 42,
      android: 38,
      default: 38,
    }),
    fontWeight: 'bold',
    color: '#EEFF00',
    textAlign: 'center',
    marginVertical: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 600,
  },
  menuCardBase: {
    borderRadius: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
    overflow: 'hidden',
  },
  smallCardLayout: {
    width: (width / 2) - 25,
    height: (width / 2 - 25) * 1.05,
    aspectRatio: 1 / 1.05,
  },
  pokedexCardLayout: {
    width: width - 30,
    height: width * 0.48,
    marginBottom: 20,
  },
  menuCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  menuIcon: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    marginBottom: 5,
  },
  menuText: {
    fontSize: Platform.select({
      ios: 19,
      android: 17,
      default: 17,
    }),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    lineHeight: Platform.select({ ios: 23, android: 20, default: 20 }),
  },
});
