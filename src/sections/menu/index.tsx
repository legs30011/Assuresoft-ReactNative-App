import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../navigation/RootNavigation';

const { width } = Dimensions.get('window');

// Datos para las categorías del menú
const menuCategories = [
  { name: 'FIRE', type: 'fire', image: 'https://placehold.co/600x400/FD7D24/FFFFFF?text=FIRE' },
  { name: 'WATER', type: 'water', image: 'https://placehold.co/600x400/4592C4/FFFFFF?text=WATER' },
  { name: 'GRASS', type: 'grass', image: 'https://placehold.co/600x400/9BCC50/FFFFFF?text=GRASS' },
  { name: 'ELECTRIC', type: 'electric', image: 'https://placehold.co/600x400/F7D02C/FFFFFF?text=ELECTRIC' },
  { name: 'NORMAL', type: 'normal', image: 'https://placehold.co/600x400/A8A77A/FFFFFF?text=NORMAL' },
  { name: 'BUG', type: 'bug', image: 'https://placehold.co/600x400/729F3F/FFFFFF?text=BUG' },
  { name: 'POISON', type: 'poison', image: 'https://placehold.co/600x400/B97FC9/FFFFFF?text=POISON' },
  { name: 'FIGHTING', type: 'fighting', image: 'https://placehold.co/600x400/D56723/FFFFFF?text=FIGHTING' },
  { name: 'GROUND', type: 'ground', image: 'https://placehold.co/600x400/F7DE3F/FFFFFF?text=GROUND' },
  { name: 'FLYING', type: 'flying', image: 'https://placehold.co/600x400/3DC7EF/FFFFFF?text=FLYING' },
  { name: 'PSYCHIC', type: 'psychic', image: 'https://placehold.co/600x400/F366B9/FFFFFF?text=PSYCHIC' },
  { name: 'ROCK', type: 'rock', image: 'https://placehold.co/600x400/A38C21/FFFFFF?text=ROCK' },
  { name: 'ICE', type: 'ice', image: 'https://placehold.co/600x400/51C4E7/FFFFFF?text=ICE' },
  { name: 'GHOST', type: 'ghost', image: 'https://placehold.co/600x400/7B62A3/FFFFFF?text=GHOST' },
  { name: 'DRAGON', type: 'dragon', image: 'https://placehold.co/600x400/53A4CF/FFFFFF?text=DRAGON' },
  { name: 'STEEL', type: 'steel', image: 'https://placehold.co/600x400/9EB7B8/FFFFFF?text=STEEL' },
  { name: 'FAIRY', type: 'fairy', image: 'https://placehold.co/600x400/FDB9EA/FFFFFF?text=FAIRY' },
  { name: 'DARK', type: 'dark', image: 'https://placehold.co/600x400/707070/FFFFFF?text=DARK' },
];

export default function MenuScreen() {
  const insets = useSafeAreaInsets();

  const handleCategoryPress = (type: string) => {
    console.log(`Navegando a PokemonListScreen con tipo: ${type}`);
    navigate('PokemonListScreen', { type });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 0) }]}>
      <Text style={styles.headerTitle}>Pokémon Categories</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {menuCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.type)}
            >
              <ImageBackground source={{ uri: category.image }} style={styles.categoryImageBackground} imageStyle={styles.categoryImageStyle}>
                <View style={styles.overlay}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EEFF00',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryCard: {
    width: (width / 2) - 30,
    height: 120,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
  },
  categoryImageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  categoryImageStyle: {
    opacity: 0.7,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
