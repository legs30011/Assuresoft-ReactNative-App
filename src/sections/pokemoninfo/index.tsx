import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';

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

  useEffect(() => {
    const fetchAllPokemons = async () => {
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
    };

    fetchAllPokemons();
  }, []);

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

  const renderPokemonListItem = ({ item }: { item: PokemonListItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => fetchPokemonDetails(item.name)}
    >
      <Text style={styles.listItemText}>{item.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color="#0000ff" />
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
    <View style={styles.pokemonSectionContainer}>
      <Text style={styles.title}>Pokédex</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Busca un Pokémon..."
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loadingDetails ? (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#0000ff" />
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
        <FlatList
          data={filteredPokemons}
          renderItem={renderPokemonListItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.flatListContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pokemonSectionContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  title: {
    marginTop: 50,
    fontSize: 38,
    fontWeight: 'bold',
    color: '#eeff00', 
    marginBottom: 20,
    textShadowColor: 'rgb(98, 255, 0)', // Sombra más pronunciada
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  searchInput: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo blanco semitransparente
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#70ff2e', // Borde que combine
    shadowColor: '#33ff06', // Sombra azul
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    color: '#ffffff', // Color de texto oscuro para contraste
  },
  flatListContent: {
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: 'rgba(74, 255, 37, 0.85)', 
    borderRadius: 12,
    margin: 8,
    width: width / 2 - 20,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#eeff00', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 7,
    borderWidth: 3,
    borderColor: '#eeff00', // Borde más claro
  },
  listItemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#092e00', // Color de texto oscuro para contraste
    textTransform: 'capitalize',
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo blanco semitransparente
    borderRadius: 20,
    margin: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#00ff5e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    width: '95%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#33ff00', 
  },
  pokemonName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textTransform: 'capitalize',
    textShadowColor: 'rgb(255, 255, 255)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  pokemonImage: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: 25,
    backgroundColor: 'hsla(0, 0%, 100%, 0.7)', 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#33ff00',
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
    color: '#ffffff',
    marginTop: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    color: '#e74c3c', // Rojo de error
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
  backButton: {
    marginTop: 30,
    backgroundColor: '#33ff00', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 9,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Pokemon;
