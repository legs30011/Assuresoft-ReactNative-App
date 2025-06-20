import { StackNavigationProp } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  HomeScreen: undefined;
  PokemonListScreen: { type?: string };
  PokemonDetailScreen: { pokemonId: number; primaryColor?: string; pokemonName?: string };
  LocationDetailScreen: { locationName: string; };
  MovesScreen: undefined;
  AbilitiesScreen: undefined;
  ItemsScreen: undefined;
  NaturesScreen: undefined;
  TypeChartScreen: undefined;
  ComingSoonScreen: { from: string };
  SearchScreen: undefined;
  EvolutionScreen: undefined;
  NotificationsScreen: undefined;
  UserScreen: undefined;
  SettingsScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;
export type PokemonListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonListScreen'>;
export type PokemonDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonDetailScreen'>;
export type LocationDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LocationDetailScreen'>;
export type MovesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovesScreen'>;
export type AbilitiesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AbilitiesScreen'>;
export type ItemsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ItemsScreen'>;
export type NaturesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NaturesScreen'>;
export type TypeChartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TypeChartScreen'>;

export type ComingSoonScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ComingSoonScreen'>;
export type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchScreen'>;
export type EvolutionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EvolutionScreen'>;
export type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NotificationsScreen'>;
export type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserScreen'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SettingsScreen'>;
