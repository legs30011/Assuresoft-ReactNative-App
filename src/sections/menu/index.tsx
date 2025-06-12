import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { navigate } from '../../navigation/RootNavigation';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Esta es la Pantalla de Menú!</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigate('Home')}
      >
        <Text style={styles.backButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingTop: 130,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eeff00',
    marginBottom: 30,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#eeff00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 9,
  },
  backButtonText: {
    color: '#040404',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
