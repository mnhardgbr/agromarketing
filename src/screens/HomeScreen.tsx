import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>AgroMarketing</Text>
          <Text style={styles.subtitle}>Seu marketplace agrícola</Text>
        </View>

        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryCard}>
            <Image 
              source={require('../assets/images/bovinos.jpg')} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryTitle}>Bovinos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Image 
              source={require('../assets/images/equinos.jpg')} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryTitle}>Equinos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Image 
              source={require('../assets/images/equipamentos.jpg')} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryTitle}>Equipamentos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featured}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          {/* Aqui virá a lista de itens em destaque */}
        </View>
      </ScrollView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  categoryCard: {
    alignItems: 'center',
    width: '30%',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  featured: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
});

export default HomeScreen; 