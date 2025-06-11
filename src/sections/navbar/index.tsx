import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Navbar() {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => console.log('Botón de menú presionado')}>
                <Text style={styles.navText}>☰ Menú</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Mi Aplicación</Text>
            <TouchableOpacity onPress={() => console.log('Botón de perfil presionado')}>
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
        alignItems: 'center',
        backgroundColor: '#33ff06', 
        paddingHorizontal: 20,
        position: 'absolute', 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontWeight: 'bold',
        marginTop: 50,
        fontSize: 22,
        color: '#eeff00', 
        marginBottom: 20,
        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    navText: {
        fontSize: 18,
        marginTop: 50,
        fontWeight: 'bold',
        color: '#eeff00', 
        marginBottom: 20,
        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
});
