/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { SafeAreaView, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/sections/homeScreen/HomeScreen';
import PokemonInfoScreen from './src/sections/pokemoninfo';
import PokemonDetailScreen from './src/sections/pokemonDetailScreen/PokemonDetailScreen';
import LocationDetailScreen from './src/sections/locationDetailScreen/LocationDetailScreen';
import MovesScreen from './src/sections/moves/MovesScreen';
import ItemsScreen from './src/sections/items/ItemsScreen';
import NaturesScreen from './src/sections/natures/NaturesScreen';
import TypeChartScreen from './src/sections/typeChart/TypeChartScreen';
import { navigationRef } from './src/navigation/RootNavigation';
import { RootStackParamList } from './src/types/navigation';
import ComingSoonScreen from './src/sections/common/ComingSoonScreen';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#000000' },
            }}
          >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="PokemonListScreen" component={PokemonInfoScreen} />
            <Stack.Screen name="PokemonDetailScreen" component={PokemonDetailScreen} />
            <Stack.Screen name="LocationDetailScreen" component={LocationDetailScreen} />
            <Stack.Screen name="ComingSoonScreen" component={ComingSoonScreen} />
            <Stack.Screen name="MovesScreen" component={MovesScreen} />
            <Stack.Screen name="ItemsScreen" component={ItemsScreen} />
            <Stack.Screen name="NaturesScreen" component={NaturesScreen} />
            <Stack.Screen name="TypeChartScreen" component={TypeChartScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenContent: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
