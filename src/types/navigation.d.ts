import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Profile: undefined;
  PokemonListScreen: { type: string };
  PokemonDetailScreen: { pokemonId: number; primaryColor?: string; pokemonName?: string };
  LocationDetailScreen: { locationName: string; };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;
export type PokemonListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonListScreen'>;
export type PokemonDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonDetailScreen'>;
