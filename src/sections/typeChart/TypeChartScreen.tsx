import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack } from '../../navigation/RootNavigation';
import LinearGradient from 'react-native-linear-gradient';

export default function TypeChartScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.fullScreenGradient}
    >
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 0) }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.backButtonHeader}>
            <Text style={styles.backButtonTextHeader}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Type Chart</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Type Chart Information</Text>
            <Text style={styles.cardMessage}>
              Building a comprehensive Type Chart requires combining data from multiple API endpoints
              or using pre-defined static data about type matchups (e.g., "Fire is strong against Grass", "Water is weak against Electric").
            </Text>
            <Text style={styles.cardMessage}>
              This section is currently a placeholder, but it's ready for future development
              to display type effectiveness in a matrix or list format!
            </Text>
          </View>
          <Text style={styles.subMessage}>
            Stay tuned for updates!
          </Text>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButtonHeader: {
    padding: 5,
  },
  backButtonTextHeader: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EEFF00',
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  headerRightPlaceholder: {
    width: 38,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'rgba(112, 112, 112, 0.7)', // Dark grey with some transparency
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    color: '#EEFF00',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  cardMessage: {
    color: '#DDDDDD',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  subMessage: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
