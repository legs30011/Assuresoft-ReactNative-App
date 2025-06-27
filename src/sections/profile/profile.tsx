import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../customHeader/CustomHeader'; 
import Footer from '../footer/Footer'; 
import { useFavorites } from '../context/FavoritesContext'; 
import { PokemonListItemDisplay } from '../../types/navigation'
import { JSX } from 'react/jsx-runtime';

const { width } = Dimensions.get('window');
const TRAINER_AVATAR = require('../../assets/trainers/ashPokemon.webp'); 
const BADGE_PLACEHOLDER1= require('../../assets/icons/m1.png');
const BADGE_PLACEHOLDER2= require('../../assets/icons/m2.png');
const BADGE_PLACEHOLDER3= require('../../assets/icons/m3.png');

export const UserScreen: React.FC = (): JSX.Element => {
  const { likedPokemons } = useFavorites(); 

  const trainer = {
    name: 'Ash Ketchum',
    hometown: 'Pueblo Paleta',
    description: '¡Un entrenador Pokémon decidido con el sueño de convertirse en Maestro Pokémon! Siempre en una aventura con su fiel Pikachu.',
    badges: [
      { id: '1', name: 'Medalla Roca', icon: BADGE_PLACEHOLDER1 },
      { id: '2', name: 'Medalla Cascada', icon: BADGE_PLACEHOLDER2 },
      { id: '3', name: 'Medalla Trueno', icon: BADGE_PLACEHOLDER3 },
    ],
  };
  const renderFavoritePokemon = ({ item }: { item: PokemonListItemDisplay }): JSX.Element => (
    <View style={styles.favoritePokemonCard}>
      <Image
        source={{ uri: item.imageUrl || '../../assets/icons/Profile.png' }} 
        style={styles.favoritePokemonImage}
      />
      <Text style={styles.favoritePokemonName}>{item.name.toUpperCase()}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <CustomHeader title="Perfil del Entrenador" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileContainer}>
          <Image source={TRAINER_AVATAR} style={styles.trainerAvatar} />
          <Text style={styles.trainerName}>{trainer.name}</Text>
          <Text style={styles.trainerHometown}>{trainer.hometown}</Text>
          <Text style={styles.trainerDescription}>{trainer.description}</Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medallas</Text>
          </View>
          {trainer.badges.length > 0 ? (
            <View style={styles.badgesContainer}>
              {trainer.badges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <Image source={badge.icon} style={styles.badgeIcon} />
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>¡Aún no se han recolectado medallas!</Text>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus Pokémon Favoritos</Text>
          </View>
          {likedPokemons.length > 0 ? (
            <FlatList
              data={likedPokemons}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderFavoritePokemon}
              numColumns={2} 
              columnWrapperStyle={styles.favoritePokemonColumnWrapper}
              contentContainerStyle={styles.favoritePokemonListContent}
              scrollEnabled={false} 
            />
          ) : (
            <Text style={styles.noDataText}>¡Aún no se han añadido Pokémon favoritos. ¡Ve a atraparlos!</Text>
          )}
        </View>
      </ScrollView>
      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, 
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  trainerAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    borderWidth: 4,
    borderColor: '#EEFF00',
    marginBottom: 20,
    backgroundColor: '#333333', 
  },
  trainerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  trainerHometown: {
    fontSize: 18,
    color: '#DDDDDD',
    marginBottom: 15,
  },
  trainerDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
    lineHeight: 22, 
  },
  sectionHeader: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)', 
    marginBottom: 15,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EEFF00', 
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    marginBottom: 30,
  },
  badgeItem: {
    alignItems: 'center',
    margin: 10,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginBottom: 30,
  },
  favoritePokemonListContent: {
    width: '100%',
    paddingVertical: 10,
  },
  favoritePokemonColumnWrapper: {
    justifyContent: 'space-around', 
    marginBottom: 15,
  },
  favoritePokemonCard: {
    width: (width - 40 - 30) / 2,
    alignItems: 'center',
    backgroundColor: 'rgba(50,50,50,0.8)', 
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  favoritePokemonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  favoritePokemonName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
