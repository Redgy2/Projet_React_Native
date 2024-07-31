import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Stack, TextInput, Button } from '@react-native-material/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from '../Constants';
import { isAuthenticated, storeData, getCommonError, createUserTable,getData,isAdmin, 
    createUser } from '../services/userService';
import * as SQLite from 'expo-sqlite';
import GestionProduitsScreen from './GestionProduitsScreen';

const db = SQLite.openDatabase('Connexion.db');


export default function Compte({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
 
  useEffect(() => {
    (async () => {
      const isUserAuthenticated = await isAuthenticated();
      if (isUserAuthenticated) {
        navigation.navigate('Compte');
      }
    })();
  }, []);


  // Appelez createUserTable pour créer la table lors du démarrage 
  useEffect(() => {
    createUserTable();
  }, []);


  useEffect(() => {
    (async () => {
      const isUserAuthenticated = await isAuthenticated();
      const isUserAdmin = await isAdmin();

      if (isUserAuthenticated && isUserAdmin) {
        // L'utilisateur est authentifié et est administrateur, redirigez-le vers la page d'administration
        navigation.navigate('Admin'); 
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const isUserAuthenticated = await isAuthenticated();
      if (isUserAuthenticated) {
        const UserData = await getData(); // Obtenir les données de l'utilisateur
        console.log('UserData :', UserData);
        if (UserData) {
          // Utiliser les données pour obtenir les initiales
          const { first_name, last_name } = UserData;
          const initials = first_name[0] + last_name[0];
          setUserInitials(initials); // Mettre à jour les initiales
        }
        navigation.navigate('Compte');
      }
    })();
  }, []);


  const authenticateUser = (email, password) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM Connexion WHERE email = ? AND password = ?;`,
          [email, password],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows.item(0));
            } else {
              reject('Authentication failed');
            }
          }
        );
      });
    });
  };

  const authenticate = async () => {
    try {
      const User = await authenticateUser(email, password);
      await storeData(User.id.toString(), 6);
  
      // Après avoir authentifié l'utilisateur, vérifiez si l'utilisateur est administrateur
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT admin FROM Connexion WHERE email = ?;',
          [email],
          (_, { rows }) => {
            const UserData = rows.item(0);
            if (UserData && UserData.admin === 1) {
              // Si l'utilisateur est administrateur, redirigez-le vers la page Admin
              console.log('C\'est un administrateur.');
              navigation.navigate('Admin');
            }
             else {
              // Sinon, redirigez-le vers la page Compte
              console.log('C\'est un utilisateur.');
              navigation.navigate('Produits');
            }
          },
          (_, error) => {
            console.error('Erreur lors de la vérification du rôle de l\'utilisateur :', error);
            setErrorMessage('Une erreur s\'est produite lors de l\'authentification.');
          }
        );
      });
    } catch (error) {
      setErrorMessage('Authentication failed');
    }
  };
  

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/Boutique.png')} />
      <View style={{ marginTop: 10 }}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
      <Stack spacing={2} style={{ margin: 8 }}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          leading={(props) => (
            <MaterialCommunityIcons name="email" {...props} />
          )}
        />
        <TextInput
          label="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          leading={(props) => (
            <MaterialCommunityIcons name="form-textbox-password" {...props} />
          )}
        />
        <Button
          title="Me connecter"
          color={Constants.primary}
          tintColor={Constants.textColor}
          onPress={authenticate}
        />
        <View style={styles.actionBox}>
          <Text>{"Vous n'avez pas un Compte ?"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
            <Text style={styles.actionBtn}>{'Créer mon Compte'}</Text>
          </TouchableOpacity>
        </View>

   <View style={styles.actionBox}>
          <Text>{"Vous avez oublié votre mot de passe?"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
            <Text style={styles.actionBtn}>{'Réinitialiser le mot de passe'}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{marginTop:20,textAlign:"center"}}>Projet fait par Luc Arbenz Sévère et Redgy Pérard</Text>
        </View>
        
       
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    top:'3%'
  },
  logo: {
    height: '40%',
    width: '55%',
  },
  actionBox: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    color: Constants.primary,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});



