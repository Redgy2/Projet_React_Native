import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Connexion.db');

const EditScreen = ({ route, navigation }) => {
  const { UserEmail } = route.params;
  const [newEmail, setNewEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Charger les informations de l'utilisateur à partir de la base de données
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Connexion WHERE email = ?;',
        [UserEmail],
        (_, { rows }) => {
          const User = rows.item(0);
          if (User) {
            setNewEmail(User.email);
            setIsAdmin(User.admin === 1); // Vérifier si l'utilisateur est administrateur
          }
        },
        (_, error) => {
          console.error('Erreur lors du chargement de l\'utilisateur :', error);
        }
      );
    });
  }, [UserEmail]);

  const saveChanges = () => {
    if (newEmail) {
      // Mettre à jour l'e-mail de l'utilisateur et son statut administrateur dans la base de données
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Connexion SET email = ?, admin = ? WHERE email = ?;',
          [newEmail, isAdmin ? 1 : 0, UserEmail],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              // Appel à la fonction de rafraîchissement après la mise à jour réussie
              //refreshData();

              // Rediriger l'utilisateur vers la page de gestion des utilisateurs
              navigation.navigate('User');
            } else {
              setErrorMessage('Aucun utilisateur trouvé avec cet e-mail.');
            }
          },
          (_, error) => {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            setErrorMessage('Une erreur s\'est produite lors de la mise à jour.');
          }
        );
      });
    } else {
      setErrorMessage('Veuillez entrer un nouvel e-mail valide.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modification de l'utilisateur</Text>
      <Text style={styles.subtitle}>Email actuel : {UserEmail}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouvel email"
        value={newEmail}
        onChangeText={(text) => setNewEmail(text)}
      />
      <Text style={styles.subtitle}>Administrateur :</Text>
      <Switch
        value={isAdmin}
        onValueChange={(value) => setIsAdmin(value)}
      />
      <Button title="Enregistrer les modifications" onPress={saveChanges} />
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default EditScreen;
