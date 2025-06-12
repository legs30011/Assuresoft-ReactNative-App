import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  height: number;
  weight: number;
}

const Pokemon = (): React.JSX.Element => {
  const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<PokemonListItem[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const fetchAllPokemons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setAllPokemons(data.results);
      setFilteredPokemons(data.results);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error desconocido al cargar los Pokémon.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedPokemon(null);
      setSearchTerm('');
      fetchAllPokemons();
      return () => {};
    }, [fetchAllPokemons])
  );

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPokemons(allPokemons);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredPokemons(filtered);
    }
  }, [searchTerm, allPokemons]);

  const fetchPokemonDetails = async (pokemonName: string) => {
    setLoadingDetails(true);
    setSelectedPokemon(null);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      const jsonData: PokemonData = await response.json();
      setSelectedPokemon(jsonData);
    } catch (err: any) {
      setError(err.message || `Ocurrió un error al cargar los detalles de ${pokemonName}.`);
    } finally {
      setLoadingDetails(false);
    }
  };

  const renderCarouselItem = ({ item }: { item: PokemonListItem }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => fetchPokemonDetails(item.name)}
    >
      <Text style={styles.carouselItemText}>{item.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color="#eeff00" />
        <Text style={styles.messageText}>Cargando lista de Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.errorText}>¡Ups! Algo salió mal:</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.messageText}>Intenta recargar la aplicación.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/backgrounds/background1.jpg')}
      style={styles.fullBackground}
      resizeMode="cover"
    >
      <View style={styles.pokemonSectionContent}>
        <Text style={styles.title}>Pokédex</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Busca un Pokémon..."
          placeholderTextColor="#C0C0C0"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {loadingDetails ? (
          <View style={styles.loadingDetailsContainer}>
            <ActivityIndicator size="large" color="#eeff00" />
            <Text style={styles.messageText}>Cargando detalles...</Text>
          </View>
        ) : selectedPokemon ? (
          <View style={styles.pokemonCard}>
            <Text style={styles.pokemonName}>{selectedPokemon.name.toUpperCase()}</Text>
            {selectedPokemon.sprites?.front_default ? (
              <Image
                source={{ uri: selectedPokemon.sprites.front_default }}
                style={styles.pokemonImage}
                onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
              />
            ) : (
              <Text style={styles.messageText}>No se encontró la imagen.</Text>
            )}

            <Text style={styles.detailText}>
              ID: {selectedPokemon.id}
            </Text>
            <Text style={styles.detailText}>
              Tipo(s): {selectedPokemon.types.map(t => t.type.name).join(', ')}
            </Text>
            <Text style={styles.detailText}>
              Altura: {selectedPokemon.height / 10} m
            </Text>
            <Text style={styles.detailText}>
              Peso: {selectedPokemon.weight / 10} kg
            </Text>
            <Text style={styles.detailText}>
              Habilidades: {selectedPokemon.abilities.map(a => a.ability.name).join(', ')}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedPokemon(null)}
            >
              <Text style={styles.backButtonText}>Volver a la lista</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Carousel
            loop
            width={width * 0.9}
            height={220}
            autoPlay={false}
            data={filteredPokemons}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={renderCarouselItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 40,
              parallaxAdjacentItemScale: 0.85,
            }}
            style={styles.carouselContainer}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pokemonSectionContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 9,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#eeff00', 
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginTop: 10,
  },
  searchInput: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#eeff00', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    color: '#ffffff',
  },
  carouselContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 0,
  },
  carouselItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 20,
    width: width * 0.78,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#eeff00',
    marginHorizontal: 10,
  },
  carouselItemText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#eeff00',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    maxWidth: width * 0.7,
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 20,
    margin: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
    width: '95%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#eeff00',
  },
  pokemonName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 15,
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  pokemonImage: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: 25,
    backgroundColor: 'rgba(240, 240, 240, 0.2)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eeff00',
  },
  detailText: {
    fontSize: 20,
    color: '#ffffff', 
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 28,
  },
  messageText: {
    fontSize: 18,
    color: '#D3D3D3', 
    marginTop: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#eeff00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Pokemon;
