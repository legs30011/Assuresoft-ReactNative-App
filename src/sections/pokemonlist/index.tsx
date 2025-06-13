import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { navigate } from '../../navigation/RootNavigation';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import axios from 'axios';

interface PokemonListItemDetail {
  name: string;
  url: string;
  imageUrl?: string;
}

interface PokemonTypeApiResult {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

interface PokemonTypeData {
  id: number;
  name: string;
  pokemon: PokemonTypeApiResult[];
}

interface PokemonDetailData {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{ type: { name: string } }>;
}

type PokemonListScreenRouteProp = RouteProp<RootStackParamList, 'PokemonListScreen'>;


export default function PokemonListScreen() {
  const route = useRoute<PokemonListScreenRouteProp>();
  const { type } = route.params;

  const [pokemons, setPokemons] = useState<PokemonListItemDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPokemonsByType = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const typeResponse = await axios.get<PokemonTypeData>(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonUrls = typeResponse.data.pokemon;
      const pokemonDetailsPromises = pokemonUrls.map(async (entry) => {
        const detailResponse = await axios.get<PokemonDetailData>(entry.pokemon.url);
        return {
          name: detailResponse.data.name,
          url: entry.pokemon.url,
          imageUrl: detailResponse.data.sprites?.front_default || undefined,
        };
      });

      const pokemonsWithDetails = await Promise.all(pokemonDetailsPromises);
      setPokemons(pokemonsWithDetails);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error al cargar Pokémon de tipo ${type}: ${err.response?.statusText || err.message}`);
      } else if (err instanceof Error) {
        setError(`Ocurrió un error: ${err.message}.`);
      } else {
        setError('Ocurrió un error desconocido al cargar los Pokémon.');
      }
      console.error('Error fetching Pokémon by type:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchPokemonsByType();
  }, [fetchPokemonsByType]);
  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <ActivityIndicator size="large" color="#eeff00" />
        <Text style={styles.loadingText}>Cargando Pokémon de tipo {type.toUpperCase()}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <Text style={styles.errorText}>¡Ups! Algo salió mal:</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate('Menu')}
        >
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Pokémon de Tipo: {type.toUpperCase()}</Text>

      {pokemons.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={styles.subText}>No se encontraron Pokémon de este tipo.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigate('Menu')}
          >
            <Text style={styles.backButtonText}>Volver al Menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.name}
          numColumns={2} // Mostrar 2 columnas de Pokémon
          contentContainerStyle={styles.pokemonListContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pokemonCard}
              onPress={() => console.log('Ver detalles de:', item.name)}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.pokemonImage} />
              ) : (
                <View style={styles.pokemonImagePlaceholder}>
                  <Text style={styles.pokemonImagePlaceholderText}>No Image</Text>
                </View>
              )}
              <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {pokemons.length > 0 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate('Menu')}
        >
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 80,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingText: {
    color: '#eeff00',
    fontSize: 18,
    marginTop: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  pokemonListContent: {
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    shadowColor: '#eeff00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#eeff00',
  },
  pokemonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  pokemonImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#666666',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#eeff00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
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
