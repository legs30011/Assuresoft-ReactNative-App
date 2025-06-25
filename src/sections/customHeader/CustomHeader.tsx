import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack } from '../../navigation/RootNavigation';
import { JSX } from 'react/jsx-runtime';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const CONTAINER_HORIZONTAL_PADDING = 20;
const PokeBallIcon = ({ size = 24 }: { size?: number }): JSX.Element => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: size / 20,
      borderColor: '#333',
      backgroundColor: '#E73B5B',
      overflow: 'hidden',
    }}>
      <View style={{
        width: size,
        height: size / 2,
        backgroundColor: '#E73B5B',
        position: 'absolute',
        top: 0,
        left: 0,
      }} />
      <View style={{
        width: size,
        height: size / 2,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
      }} />
      <View style={{
        width: size / 4,
        height: size / 4,
        borderRadius: size / 8,
        backgroundColor: '#FFFFFF',
        borderWidth: size / 20,
        borderColor: '#333',
        position: 'absolute',
        alignSelf: 'center',
        top: (size / 2) - (size / 8),
        zIndex: 1,
      }} />
    </View>
  </View>
);

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, showBackButton = true }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 0) }]}>
            <View style={styles.headerContainer}>
            <PokeBallIcon size={30} />
            <Text style={styles.headerTitle}>{title}</Text>
            {showBackButton && (
                <TouchableOpacity style={styles.backButtonHeader} onPress={goBack}>
                <Text style={styles.backButtonTextHeader}>←</Text>
                </TouchableOpacity>
            )}
            </View>
    <View style={styles.headerRightPlaceholder} /> 
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex:0, 
  },
  backButtonHeader: {
    padding: 5,
    marginRight: 10,
  },
  backButtonTextHeader: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backButtonPlaceholder: {
    width: 10, 
  },
  headerRightPlaceholder: {
    width: 10, 
  },
  headerContainer: {
    backgroundColor: '#bf4141',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
    paddingBottom: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: Platform.OS === 'ios' ? 120 : 100,
},
headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
},
headerRightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRightIconText: {
    fontSize: 24,
    color: '#E73B5B',
    fontWeight: 'bold',
  },
});

export default CustomHeader;
