import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../navigation/RootNavigation';
import { RootStackParamList } from '../../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const BACKGROUND_PATTERN = 'https://placehold.co/10x10/333333/333333?text=+&font=arial&opacity=10';

const menuItems = [
  {
    name: 'Pokédex',
    iconName: 'aim',
    screen: 'PokemonListScreen',
    colors: ['#E73B5B', '#C2002E'],
  },
  {
    name: 'Moves',
    iconName: 'sword-cross',
    screen: 'MovesScreen',
    colors: ['#F7D02C', '#F3A800'],
  },
  {
    name: 'Abilities',
    iconName: 'lightning-bolt',
    screen: 'AbilitiesScreen',
    colors: ['#B97FC9', '#905A9C'],
  },
  {
    name: 'Items',
    iconName: 'bag-personal',
    screen: 'ItemsScreen',
    colors: ['#9EB7B8', '#7E9C9E'],
  },
  {
    name: 'Parties',
    iconName: 'account-group',
    screen: 'ComingSoonScreen',
    colors: ['#4592C4', '#2C6D9E'],
  },
  {
    name: 'Locations',
    iconName: 'map-marker',
    screen: 'LocationDetailScreen',
    params: { locationName: 'pallet-town' },
    colors: ['#9BCC50', '#7AA040'],
  },
  {
    name: 'Natures',
    iconName: 'leaf',
    screen: 'NaturesScreen',
    colors: ['#D56723', '#A84C1C'],
  },
  {
    name: 'Type Chart',
    iconName: 'chart-bar',
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
                    <Icon name={item.iconName} size={60} color="#ffffff" style={styles.menuIcon} />
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
