import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { navigate } from '../../navigation/RootNavigation';
const { width } = Dimensions.get('window');
const SPACING = 15;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - (NUM_COLUMNS + 1) * SPACING) / NUM_COLUMNS;

interface PokemonType {
  name: string;
  color: string;
}

export default function MenuScreen() {
  const pokemonTypes: PokemonType[] = [
    { name: 'Normal', color: '#A8A77A' },
    { name: 'Fire', color: '#EE8130' },
    { name: 'Water', color: '#6390F0' },
    { name: 'Grass', color: '#7AC74C' },
    { name: 'Electric', color: '#F7D02C' },
    { name: 'Ice', color: '#96D9D6' },
    { name: 'Fighting', color: '#C22E28' },
    { name: 'Poison', color: '#A33EA1' },
    { name: 'Ground', color: '#E2BF65' },
    { name: 'Flying', color: '#A98FF3' },
    { name: 'Psychic', color: '#F95587' },
    { name: 'Bug', color: '#A6B91A' },
    { name: 'Rock', color: '#B6A136' },
    { name: 'Ghost', color: '#735797' },
    { name: 'Dragon', color: '#6F35FC' },
    { name: 'Steel', color: '#B7B7CE' },
    { name: 'Fairy', color: '#D685AD' },
  ];

  const handleTypePress = (type: string) => {
    navigate('PokemonListScreen', { type: type.toLowerCase() });
  };

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerText}>Selecciona un Tipo de Pokémon</Text>

      <View style={styles.typesGrid}>
        {pokemonTypes.map((typeObj: PokemonType, index: number) => (
          <TouchableOpacity
            key={index}
            style={[styles.typeButton, { backgroundColor: typeObj.color || '#666666' }]}
            onPress={() => handleTypePress(typeObj.name)}
          >
            <Text style={styles.typeButtonText}>{typeObj.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigate('Home')}
      >
        <Text style={styles.backButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingTop: 100,
    paddingHorizontal: SPACING,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  typeButton: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  typeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#eeff00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#535353',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 9,
  },
  backButtonText: {
    color: '#040404',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
