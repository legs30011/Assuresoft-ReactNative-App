/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Pokemon from './src/sections/pokemoninfo';
import MenuScreen from './src/sections/menu';
import PokemonListScreen from './src/sections/pokemonlist';
import PokemonDetailScreen from './src/sections/pokemonDetailScreen/PokemonDetailScreen';


import { navigationRef } from './src/navigation/RootNavigation';
import { RootStackParamList } from './src/types/navigation';
import LocationDetailScreen from './src/sections/locationDetailScreen/LocationDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen() {
  return (
    <View style={styles.homeScreenContainer}>
      <Pokemon/>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#000000' },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="PokemonListScreen" component={PokemonListScreen} options={{ title: 'Pokémon por Tipo' }} />
            <Stack.Screen name="PokemonDetailScreen" component={PokemonDetailScreen} />
            <Stack.Screen name="LocationDetailScreen" component={LocationDetailScreen} />
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
  homeScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
