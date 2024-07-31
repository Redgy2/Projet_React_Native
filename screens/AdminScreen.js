import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { clearData, onAppClose } from '../services/userService';

const AdminScreen = ({ navigation }) => {
  const logout = async () => {
    await clearData();
    navigation.navigate('Compte');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue administrateur</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => navigation.navigate('User')}
      >
        <Text style={styles.buttonText}>Gestion des Utilisateurs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('Gestion des Produits')}
      >
        <Text style={styles.buttonText}>Gestion des Produits</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFF4',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'red',
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
