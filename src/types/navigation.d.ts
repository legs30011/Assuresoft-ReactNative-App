import { StackNavigationProp } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';

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
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}
interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
}

export interface PokemonListItemDisplay extends PokemonDetailData {
  imageUrl?: string;
  primaryTypeColor?: string;
}
export type RootStackParamList = {
  HomeScreen: undefined;
  PokemonListScreen: { selectedType?: string };
  PokemonDetailScreen: { pokemonId: number; primaryColor: string; pokemonName: string };
  LocationDetailScreen: { locationName: string; }; 
  MovesScreen: undefined;
  AbilitiesScreen: undefined; 
  NaturesScreen: undefined; 
  TypeChartScreen: undefined;
  ComingSoonScreen: { from: string };
  SearchScreen: undefined;
  NotificationsScreen: undefined; 
  UserScreen: undefined; 
  SettingsScreen: undefined; 
  YourTeamScreen: { initialTeam: PokemonListItemDisplay[] };
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;
export type PokemonListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonListScreen'>;
export type PokemonDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonDetailScreen'>;
export type YourTeamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'YourTeamScreen'>;

