/* eslint-disable quotes */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack } from '../../navigation/RootNavigation';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

interface Nature {
  name: string;
  url: string;
  increased_stat: { name: string; url: string } | null;
  decreased_stat: { name: string; url: string } | null;
}

export default function NaturesScreen() {
  const insets = useSafeAreaInsets();
  const [natures, setNatures] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNatures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetching all natures (usually a small list)
      const response = await axios.get('https://pokeapi.co/api/v2/nature/?limit=100');
      setNatures(response.data.results);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error fetching natures: ${err.response?.statusText || err.message}`);
      } else if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred while fetching natures.');
      }
      console.error("Error fetching natures:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNatures();
  }, [fetchNatures]);

  const renderNatureItem = ({ item }: { item: Nature }) => (
    <LinearGradient
      colors={['#D56723', '#A84C1C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardGradient}
    >
      <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
      {item.increased_stat && (
        <Text style={styles.cardSubtitle}>
          Increases: {item.increased_stat.name.toUpperCase().replace(/-/g, ' ')}
        </Text>
      )}
      {item.decreased_stat && (
        <Text style={styles.cardSubtitle}>
          Decreases: {item.decreased_stat.name.toUpperCase().replace(/-/g, ' ')}
        </Text>
      )}
      {!item.increased_stat && !item.decreased_stat && (
        <Text style={styles.cardSubtitle}>No stat change</Text>
      )}
    </LinearGradient>
  );

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
          <Text style={styles.headerTitle}>Natures</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {loading ? (
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#EEFF00" />
            <Text style={styles.loadingText}>Loading Natures...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredContent}>
            <Text style={styles.errorText}>Oops! Something went wrong:</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={natures}
            keyExtractor={(item) => item.name}
            renderItem={renderNatureItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 30,
  },
  cardGradient: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
});
