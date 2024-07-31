import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from '../Constants';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { clearData } from '../services/userService';

const db = SQLite.openDatabase('Connexion.db');

const UserDashboardScreen = ({ navigation }) => {
  const logout = async () => {
    await clearData();
    navigation.navigate('Compte');
  };

  const [UserData, setUserData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      //  exécuter chaque fois que la page est mise au premier plan
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT email, admin FROM Connexion;',
          [],
          (_, { rows }) => {
            const UserData = rows._array.map((item) => ({
              email: item.email,
              admin: item.admin,
              key: uuidv4(),
            }));
            setUserData(UserData);
          },
          (_, error) => {
            console.error('Erreur lors du chargement des données utilisateur :', error);
          }
        );
      });
    }, [])
  );

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT email, admin FROM Connexion;',
        [],
        (_, { rows }) => {
          const UserData = rows._array.map((item) => ({
            email: item.email,
            admin: item.admin,
            key: uuidv4(),
          }));
          setUserData(UserData);
        },
        (_, error) => {
          console.error('Erreur lors du chargement des données utilisateur :', error);
        }
      );
    });
  }, []);

  const DeleteUser = (email) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Connexion WHERE email = ?;',
        [email],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            setUserData((prevUserData) =>
              prevUserData.filter((prevUser) => prevUser.email !== email)
            );
          } else {
            // Aucun utilisateur trouvé avec cet e-mail
          }
        },
        (_, error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
      );
    });
  };

  const EditUser = (email) => {
    navigation.navigate('Edit', { UserEmail: email });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Retour"
          color={Constants.secondary}
          tintColor={Constants.textColor}
          onPress={() => navigation.navigate('Admin')}
        />
      </View>

      <View >
        <Text style={styles.textheader}>Gestion des utilisateurs</Text>
      </View>
      
      <Button title="Déconnexion" onPress={logout} />



      <FlatList style={styles.UserFlat}
        data={UserData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.UserItem}>
            <Text style={styles.UserEmail}>{item.email}</Text>
            <Text style={styles.adminStatus}>
              {item.admin ? 'Admin' : 'Client'}
            </Text>

            <View style={styles.IconeUnique}>
            <TouchableOpacity
              onPress={() => EditUser(item.email)}
              style={styles.iconButton}
            >
              <Icon name="edit" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => DeleteUser(item.email)}
              style={styles.iconButton}
            >
              <Icon name="trash" size={24} color="red" />
            </TouchableOpacity>
            </View>

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 20,
    top: '3%',
  }, 
  textheader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '5%',
  },
  UserItem: {
    //flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding:3,
    //elevation: 2,
   // height:'100%',
    width:'100%',
  },
  UserEmail: {
    fontSize: 18,
    color: 'black',
  },
  adminStatus: {
    fontSize: 16,
    color: 'blue', 
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    right:"21%",
    top:"3%",
  },
  IconeUnique:{
    flexDirection: 'row',
  },
  UserFlat:{
    width:'100%',
    
  }
});

export default UserDashboardScreen;
