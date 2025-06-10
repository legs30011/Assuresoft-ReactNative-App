import React from 'react';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Hero() {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/backgrounds/background1.jpg')}
                style={styles.backgroundImage}
             />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height * 0.5,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: '100%', 
    },
    mainText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
});
