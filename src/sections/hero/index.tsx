import React from 'react';
import { View, ImageBackground, StyleSheet, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Hero() {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/backgrounds/background1.jpg')}
                style={styles.backgroundImage}
            >
                <Text style={styles.mainText}>¡Bienvenido a la Pokédex!</Text>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height * 0.05,
        marginBottom: 0,
        marginTop: 0,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%', 
    },
    mainText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#eeff00',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 5,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
