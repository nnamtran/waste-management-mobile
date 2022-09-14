import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, View, StyleSheet, Button, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
const COLORS = {primary: '#FFE7C9' , white: '#FFF'};

const ResultScreen = () => {
    
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('...Loading');

    
    const route = useRoute();
    const barcode = route.params.barcode;
    
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
            'X-RapidAPI-Key': '51b32748f3msh07d3784cff8ad81p1046f7jsn6a0721dbdce1',
            'X-RapidAPI-Host': 'barcodes1.p.rapidapi.com'
            }
        };
        
        fetch('https://barcodes1.p.rapidapi.com/?query=' + parseInt(barcode), options)
            .then(response => response.json())
            .then((responseJson) => {
            console.log(responseJson)
            setTitle(responseJson['product']['title'])
            setImage(responseJson['product']['images'][0])
        })
        .catch(err => console.error(err));
    }, []);
    return (
        <SafeAreaView style={styles.container} >
            <View style={{margin: '10%'}}><Text style={styles.barcode}>{barcode}</Text></View>
            <View style={{margin: '10%'}}><Text style={styles.title}>{title}</Text></View>
            <View style={{margin: '10%'}}><Image source={{uri: image}} style={styles.image}/></View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        height: '100%',
        alignItems: 'center'
    },
    barcode: {
        fontFamily: 'Figtree',
        fontSize: 32,
        fontWeight: 'bold'
        
    },
    title: {
        fontFamily: 'Figtree',
        fontSize: 16,
        textAlign: 'center'

    },
    image: {
        width: 250,
        height: 250
    }
});

export default ResultScreen;