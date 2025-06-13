import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { navigate } from '../../navigation/RootNavigation';
import axios from 'axios';

interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonAbilitySlot {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokemonSprites {
  front_default: string | null;
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
}

export default function ProfileScreen() {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pokemonId = 6;

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        setPokemonData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(`Error al cargar Pokémon: ${err.response?.statusText || err.message}`);
        } else if (err instanceof Error) {
          setError(`No se pudo cargar la información del Pokémon: ${err.message}.`);
        } else {
          setError('Ocurrió un error desconocido al cargar la información del Pokémon. Intenta de nuevo.');
        }
        console.error('Error fetching Pokémon data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#eeff00" />
        <Text style={styles.loadingText}>Cargando perfil del Entrenador...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate('Home')}
        >
          <Text style={styles.backButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileCard}>
        <Text style={styles.trainerName}>Entrenador Pokémon: {pokemonData?.name ? pokemonData.name.toUpperCase() + "'s Trainer" : 'Desconocido'}</Text>
        <Text style={styles.profileText}>¡Este es el perfil de tu Pokémon favorito!</Text>
        {pokemonData && (
          <View style={styles.pokemonInfo}>
            {pokemonData.sprites?.front_default && (
              <Image
                source={{ uri: pokemonData.sprites.front_default }}
                style={styles.pokemonImage}
              />
            )}
            <Text style={styles.pokemonName}>{pokemonData.name.toUpperCase()}</Text>
            <Text style={styles.pokemonDetail}>ID: #{pokemonData.id}</Text>
            <Text style={styles.pokemonDetail}>Altura: {pokemonData.height / 10} m</Text>
            <Text style={styles.pokemonDetail}>Peso: {pokemonData.weight / 10} kg</Text>

            <Text style={styles.sectionTitle}>Tipos:</Text>
            <View style={styles.typesContainer}>
              {pokemonData.types.map((typeInfo: PokemonTypeSlot, index: number) => (
                <Text key={index} style={styles.typeBadge}>
                  {typeInfo.type.name.toUpperCase()}
                </Text>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Habilidades:</Text>
            <View style={styles.abilitiesContainer}>
              {pokemonData.abilities.map((abilityInfo: PokemonAbilitySlot, index: number) => (
                <Text key={index} style={styles.abilityText}>
                  • {abilityInfo.ability.name.replace('-', ' ').toUpperCase()}
                </Text>
              ))}
            </View>
          </View>
        )}
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingTop: 130,
  },
  loadingContainer: {
  },
  loadingText: {
    color: '#eeff00',
    fontSize: 18,
    marginTop: 10,
  },
  errorContainer: {
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#333333',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#eeff00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#eeff00',
  },
  trainerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 25,
    textAlign: 'center',
  },
  pokemonInfo: {
    alignItems: 'center',
    width: '100%',
  },
  pokemonImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
    backgroundColor: '#555555',
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#eeff00',
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  pokemonDetail: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eeff00',
    marginTop: 20,
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  typeBadge: {
    backgroundColor: '#ff0000',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 5,
    minWidth: 80,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  abilitiesContainer: {
    alignItems: 'flex-start',
    width: '80%',
  },
  abilityText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 5,
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
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
