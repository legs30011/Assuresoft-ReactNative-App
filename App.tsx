import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Navbar from './src/sections/navbar';
import Hero from './src/sections/hero';
import Pokemon from './src/sections/pokemoninfo';
import MenuScreen from './src/sections/menu';
import ProfileScreen from './src/sections/profile';
import PokemonListScreen from './src/sections/pokemonlist';
import { navigationRef } from './src/navigation/RootNavigation';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.homeScreenScrollViewContent}>
      <Hero/>
      <Pokemon/>
    </ScrollView>
  );
}

function App(): React.JSX.Element {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <Navbar/>
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
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PokemonListScreen" component={PokemonListScreen} options={{ title: 'Pokémon por Tipo' }} />
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
  homeScreenScrollViewContent: {
    flexGrow: 1,
    paddingTop: 70,
    backgroundColor: '#000000',
  },
});

export default App;
