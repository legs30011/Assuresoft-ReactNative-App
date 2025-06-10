import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Navbar from './src/sections/navbar';
import Pokemon from './src/sections/pokemoninfo';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#333" />
      <Navbar/>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Pokemon/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default App;
