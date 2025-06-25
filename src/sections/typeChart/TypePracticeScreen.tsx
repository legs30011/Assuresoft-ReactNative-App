import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '..//customHeader/CustomHeader';
import Footer from '../footer/Footer';
import { JSX } from 'react/jsx-runtime';

const TypePracticeScreen: React.FC = (): JSX.Element => {
  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <CustomHeader title="Type Practice" showBackButton={true} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Type Practice Mode!</Text>
        <Text style={styles.subtitle}>Here you can improve your knowledge of Pokémon type strengths and weaknesses.</Text>
        <Text style={styles.comingSoonText}>Practice content coming soon!</Text>
      </View>

      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EEFF00',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  comingSoonText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default TypePracticeScreen;
