import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PokemonListItemDisplay } from '../../types/navigation';

interface FavoritesContextType {
  likedPokemons: PokemonListItemDisplay[];
  toggleFavorite: (pokemon: PokemonListItemDisplay) => void;
  getIsFavorite: (pokemonId: number) => boolean;
  removeFavorite: (pokemonId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [likedPokemons, setLikedPokemons] = useState<PokemonListItemDisplay[]>([]);

  const toggleFavorite = (pokemon: PokemonListItemDisplay) => {
    setLikedPokemons(prevLikedPokemons => {
      const isCurrentlyLiked = prevLikedPokemons.some(p => p.id === pokemon.id);
      if (isCurrentlyLiked) {
        return prevLikedPokemons.filter(p => p.id !== pokemon.id);
      } else {
        return [...prevLikedPokemons, pokemon];
      }
    });
  };

  const getIsFavorite = (pokemonId: number): boolean => {
    return likedPokemons.some(p => p.id === pokemonId);
  };

  const removeFavorite = (pokemonId: number): void => {
    setLikedPokemons(prevLikedPokemons => prevLikedPokemons.filter(p => p.id !== pokemonId));
  };

  const contextValue: FavoritesContextType = {
      likedPokemons,
      toggleFavorite,
      getIsFavorite,
      removeFavorite
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
