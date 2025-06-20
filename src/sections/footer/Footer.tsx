import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../navigation/RootNavigation';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

// --- FOOTER ICONS ---
const HOME_FOOTER_ICON = require('../../assets/icons/pokeball.webp');
const NOTIFICATIONS_FOOTER_ICON_PLACEHOLDER = require('../../assets/icons/pokeball.webp');
const USER_FOOTER_ICON_PLACEHOLDER = require('../../assets/icons/pokeball.webp');

// Define las propiedades que el componente Footer puede recibir
interface FooterProps {
}

const Footer: React.FC<FooterProps> = () => {
  const insets = useSafeAreaInsets();
  const handleFooterNavigation = (screenName: keyof RootStackParamList, params?: any) => {
    navigate(screenName, params);
  };

  return (
    <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 0 : 10) }]}>
      <View style={styles.tabBarInner}>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => handleFooterNavigation('ComingSoonScreen', { from: 'Notifications' })}
        >
          <Image
            source={{ uri: NOTIFICATIONS_FOOTER_ICON_PLACEHOLDER }}
            style={styles.tabBarIcon}
          />
          <Text style={styles.tabBarText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => handleFooterNavigation('HomeScreen')}
        >
          <Image
            source={HOME_FOOTER_ICON}
            style={[styles.tabBarIcon, styles.homeTabIcon]} 
          />
          <Text style={styles.tabBarText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => handleFooterNavigation('ComingSoonScreen', { from: 'User' })}
        >
          <Image
            source={{ uri: USER_FOOTER_ICON_PLACEHOLDER }}
            style={styles.tabBarIcon}
          />
          <Text style={styles.tabBarText}>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 40, 
    height: 70,
    width: width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  tabBarButton: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabBarIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#ffffff',
    marginBottom: 4,
  },
  homeTabIcon: {
    width: 45,
    height: 45,
    marginBottom: 0,
  },
  tabBarText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Footer;