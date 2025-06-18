import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  PokemonListScreen: { type?: string };
  PokemonDetailScreen: { pokemonId: number; primaryColor?: string; pokemonName?: string };
  LocationDetailScreen: { locationName: string; };
  ComingSoonScreen: undefined;
  MovesScreen: undefined;
  AbilitiesScreen: undefined;
  ItemsScreen: undefined;
  NaturesScreen: undefined;
  TypeChartScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type PokemonListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonListScreen'>;
export type PokemonDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonDetailScreen'>;
export type LocationDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LocationDetailScreen'>;
export type MovesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovesScreen'>;
export type AbilitiesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AbilitiesScreen'>;
export type ItemsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ItemsScreen'>;
export type NaturesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NaturesScreen'>;
export type TypeChartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TypeChartScreen'>;
