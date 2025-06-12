import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { navigate } from '../../navigation/RootNavigation'; 

const { width } = Dimensions.get('window');

export default function Navbar() {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigate('Menu')} style={styles.navButton}>
                <Text style={styles.navText}>☰ Menú</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Mi Aplicación</Text>
            <TouchableOpacity onPress={() => navigate('Profile')} style={styles.navButton}>
                <Text style={styles.navText}>👤 Perfil</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        width: width,
        height: 130,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#303600',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingTop: 50,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    navButton: {
        paddingHorizontal: 5, 
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#eeff00',
        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    navText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#eeff00',
        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
});