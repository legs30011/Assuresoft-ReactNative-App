import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Profile: undefined;
  PokemonListScreen: { type: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Las propiedades de navegación para tus pantallas actuales
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;
export type PokemonListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PokemonListScreen'>;
export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
