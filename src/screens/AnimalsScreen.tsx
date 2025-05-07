import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimalsScreen = () => {
  const [animals, setAnimals] = useState([
    {
      id: '1',
      name: 'Vaca Nelore',
      price: 'R$ 5.000,00',
      location: 'São Paulo, SP',
      image: require('../assets/images/bovinos.jpg'),
    },
    // Adicione mais animais aqui
  ]);

  const renderAnimalCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.animalName}>{item.name}</Text>
        <Text style={styles.animalPrice}>{item.price}</Text>
        <Text style={styles.animalLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Animais</Text>
      </View>

      <FlatList
        data={animals}
        renderItem={renderAnimalCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  animalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  animalPrice: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 5,
  },
  animalLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default AnimalsScreen; 