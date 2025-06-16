/* eslint-disable quotes */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { goBack } from '../../navigation/RootNavigation';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

const { width } = Dimensions.get('window');

const KANTO_MAP_PLACEHOLDER = "https://placehold.co/600x400/228B22/FFFFFF?text=Location+View";


interface PokemonEncounterDetails {
  pokemon: {
    name: string;
    url: string;
  };
  version_details: any[];
}


export default function LocationDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'LocationDetailScreen'>>();
  const { locationName } = route.params;

  const [locationDetails, setLocationDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [encounteredPokemon, setEncounteredPokemon] = useState<PokemonEncounterDetails[]>([]);

  const fetchLocationDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const locationAreaListResponse = await axios.get('https://pokeapi.co/api/v2/location-area?limit=1000');
      const foundLocationArea = locationAreaListResponse.data.results.find(
        (area: { name: string; url: string }) =>
          area.name === locationName ||
          area.name === `${locationName}-area`
      );

      if (foundLocationArea) {
        // Ahora obtenemos los detalles de esa área de ubicación, incluyendo encuentros
        const areaIdMatch = foundLocationArea.url.match(/\/(\d+)\/$/);
        const areaId = areaIdMatch ? parseInt(areaIdMatch[1], 10) : null;

        if (areaId) {
          const areaDetailsResponse = await axios.get(`https://pokeapi.co/api/v2/location-area/${areaId}/`);
          setLocationDetails(areaDetailsResponse.data);

          // Obtener los Pokémon que se pueden encontrar en esta área
          const encountersResponse = await axios.get<PokemonEncounterDetails[]>(`https://pokeapi.co/api/v2/location-area/${areaId}/pokemon_encounters`);
          setEncounteredPokemon(encountersResponse.data);

        } else {
          setError(`No se pudo obtener el ID para el área de ubicación: ${locationName}`);
        }
      } else {
        // Si no se encuentra la ubicación, es un error 404
        setError(`No se encontraron detalles para la ubicación: "${locationName}". Es posible que no exista una "área de ubicación" para este nombre o su formato es diferente.`);
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error al cargar los detalles de la ubicación: ${err.response?.statusText || err.message}`);
      } else if (err instanceof Error) {
        setError(`Ocurrió un error: ${err.message}.`);
      } else {
        setError('Ocurrió un error desconocido al cargar los detalles de la ubicación.');
      }
      console.error("Error fetching location details:", err);
    } finally {
      setLoading(false);
    }
  }, [locationName]);

  useEffect(() => {
    if (locationName) {
      fetchLocationDetails();
    } else {
      setError("Nombre de ubicación no proporcionado.");
      setLoading(false);
    }
  }, [fetchLocationDetails, locationName]);


  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContent, { paddingTop: insets.top + 20 }]}>
        <ActivityIndicator size="large" color="#EEFF00" />
        <Text style={styles.loadingText}>Cargando ubicación {locationName.replace(/-/g, ' ').toUpperCase()}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centeredContent, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.errorText}>¡Ups! Algo salió mal:</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const displayLocationName = locationDetails?.name ? locationDetails.name.replace(/-/g, ' ').toUpperCase() : locationName.replace(/-/g, ' ').toUpperCase();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 0) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButtonHeader}>
          <Text style={styles.backButtonTextHeader}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{displayLocationName}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Vista de la Ubicación</Text>
        <Image
          source={{ uri: KANTO_MAP_PLACEHOLDER }}
          style={styles.mapImage}
        />
        {locationDetails ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Región: {locationDetails.region?.name.toUpperCase() || 'Desconocida'}</Text>
            {encounteredPokemon && encounteredPokemon.length > 0 ? (
              <View style={styles.pokemonEncountersContainer}>
                <Text style={styles.sectionTitleSmall}>Pokémon en esta área:</Text>
                {encounteredPokemon.map((p, index) => (
                  <Text key={index} style={styles.pokemonEncounterText}>• {p.pokemon.name.toUpperCase()}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.pokemonEncounterText}>No se encontraron Pokémon específicos en esta área.</Text>
            )}
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>No se pudieron cargar detalles adicionales de la ubicación.</Text>
            <Text style={styles.infoText}>El nombre de la ubicación es: {locationName.replace(/-/g, ' ').toUpperCase()}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#EEFF00',
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#E73B5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#E73B5B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  backButtonHeader: {
    padding: 5,
  },
  backButtonTextHeader: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  headerRightPlaceholder: {
    width: 38,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EEFF00',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  sectionTitleSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  mapImage: {
    width: width * 0.9,
    height: width * 0.6,
    borderRadius: 15,
    resizeMode: 'cover',
    marginBottom: 20,
    borderColor: '#333333',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#DDDDDD',
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  pokemonEncountersContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 15,
  },
  pokemonEncounterText: {
    fontSize: 14,
    color: '#DDDDDD',
    marginBottom: 5,
    fontFamily: 'Inter-Regular',
  },
});
