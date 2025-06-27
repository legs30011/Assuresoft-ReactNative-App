import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack, navigate } from '../../navigation/RootNavigation';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlertDialog from '../../components/customAlertDialog/CustomAlertDialog';
import Footer from '../footer/Footer';
import { PokemonListItemDisplay } from '../../types/navigation'; 
import { useFavorites } from '../context/FavoritesContext'; 
import { JSX } from 'react/jsx-runtime';

const { width } = Dimensions.get('window');
const CARD_MARGIN_HORIZONTAL = 10;
const CARD_MARGIN_VERTICAL = 15;
const NUM_COLUMNS = 2; 
const CONTAINER_HORIZONTAL_PADDING = 20;
const CALCULATED_CARD_WIDTH =
  (width - (CONTAINER_HORIZONTAL_PADDING * 2) - (CARD_MARGIN_HORIZONTAL * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

export default function YourTeamScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const { likedPokemons, toggleFavorite } = useFavorites();
  const [teamPokemons, setTeamPokemons] = useState<PokemonListItemDisplay[]>(likedPokemons);

  useEffect(() => {
    setTeamPokemons(likedPokemons);
  }, [likedPokemons]);

  const [isConfirmRemoveModalVisible, setIsConfirmRemoveModalVisible] = useState(false);
  const [pokemonToRemove, setPokemonToRemove] = useState<PokemonListItemDisplay | null>(null);

  const handleRemovePress = (pokemon: PokemonListItemDisplay) => {
    setPokemonToRemove(pokemon);
    setIsConfirmRemoveModalVisible(true);
  };

  const confirmRemovePokemon = () => {
    if (pokemonToRemove) {
      toggleFavorite(pokemonToRemove); 
      console.log(`Removed ${pokemonToRemove.name} (ID: ${pokemonToRemove.id}) from team.`);
    }
    setIsConfirmRemoveModalVisible(false);
    setPokemonToRemove(null);
  };

  const cancelRemovePokemon = () => {
    setIsConfirmRemoveModalVisible(false);
    setPokemonToRemove(null);
  };

  const renderTeamPokemonCard = ({ item }: { item: PokemonListItemDisplay }): JSX.Element => (
    <View style={styles.pokemonCardContainer}>
      <TouchableOpacity
        style={[styles.pokemonCardInner, { backgroundColor: item.primaryTypeColor || '#666666' }]}
        onPress={() => navigate('PokemonDetailScreen', {
          pokemonId: item.id,
          primaryColor: item.primaryTypeColor || '#666666',
          pokemonName: item.name,
        })}
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
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePress(item)}
      >
        <Text style={styles.removeButtonText}>✖️ Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 0) }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.backButtonHeader}>
            <Text style={styles.backButtonTextHeader}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Team</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {teamPokemons.length === 0 ? (
          <View style={styles.emptyTeamContent}>
            <Text style={styles.emptyTeamText}>Your team is empty!</Text>
            <Text style={styles.emptyTeamSubText}>Add Pokémon from the Pokédex.</Text>
          </View>
        ) : (
          <FlatList
            data={teamPokemons}
            keyExtractor={(item) => String(item.id)}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.pokemonListContent}
            renderItem={renderTeamPokemonCard}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Footer />
      {isConfirmRemoveModalVisible && pokemonToRemove && (
        <CustomAlertDialog
          isVisible={isConfirmRemoveModalVisible}
          title="Remove from Team?"
          message={`Are you sure you want to remove ${pokemonToRemove.name.toUpperCase()} from your team?`}
          imageUrl={pokemonToRemove.imageUrl}
          imageAltText={`Image of ${pokemonToRemove.name}`}
          onClose={cancelRemovePokemon}
          onConfirm={confirmRemovePokemon}
          confirmButtonText="Yes, Remove!"
          cancelButtonText="Cancel"
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EEFF00',
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  headerRightPlaceholder: {
    width: 38,
  },
  emptyTeamContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyTeamText: {
    color: '#DDDDDD',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyTeamSubText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
  pokemonListContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN_VERTICAL,
  },
  pokemonCardContainer: {
    width: CALCULATED_CARD_WIDTH,
    marginHorizontal: CARD_MARGIN_HORIZONTAL / 2,
    marginBottom: CARD_MARGIN_VERTICAL,
    borderRadius: 10,
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pokemonCardInner: {
    flex: 1,
    height: CALCULATED_CARD_WIDTH * 1.1, 
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10, 
  },
  pokemonImage: {
    width: '80%',
    height: '55%',
    resizeMode: 'contain',
    marginTop: 10,
  },
  pokemonImagePlaceholder: {
    width: '80%',
    height: '55%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pokemonImagePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  pokemonName: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 5,
  },
  removeButton: {
    backgroundColor: '#E73B5B', 
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5, 
    width: '90%',
    alignSelf: 'center', 
    marginBottom: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
