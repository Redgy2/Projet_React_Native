import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import { Stack, TextInput, Button } from '@react-native-material/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sendResetPasswordEmail } from '../services/userService'; // Importez la fonction
import Constants from '../Constants';
import * as SQLite from 'expo-sqlite';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    top: '10%',
  },
  paragraph: {
    margin: 24,
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: '40%',
    width: '50%',
  },
});

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState();

  
  const sendResetEmail = () => {
    if (email && email.length) {
      try {
        // Effectuer une requête pour rechercher l'e-mail dans la base de données
        const db = SQLite.openDatabase('Connexion.db');
        db.transaction(async (tx) => {
          try {
            const results = await new Promise((resolve, reject) => {
              tx.executeSql(
                'SELECT * FROM Connexion WHERE email = ?',
                [email],
                (_, queryResults) => resolve(queryResults),
                (_, error) => reject(error)
              );
            });
  
            if (results.rows.length > 0) {
              // L'e-mail existe dans la base de données, envoyer l'e-mail de réinitialisation
              const response = await sendResetPasswordEmail(email);
              if (response.success) {
                Alert.alert(
                  'Modification du mot de passe',
                  'Vous recevrez dans votre courriel un lien pour changer le mot de passe.'
                );
                console.log('Le lien pour la réinitialisation de mot de passe a été envoyé avec succès');
              } else {
                Alert.alert('Erreur', response.error);
              }
            } else {
              // L'e-mail n'a pas été trouvé dans la base de données, afficher un message d'erreur
              Alert.alert('Erreur', 'L\'e-mail n\'existe pas dans notre base de données.');
            }
          } catch (error) {
            console.error('Erreur lors de la recherche de l\'e-mail dans la base de données :', error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la recherche de l\'e-mail dans la base de données.');
          }
        });
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de la recherche de l\'e-mail dans la base de données.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/Boutique.png')} />
      <Text style={styles.paragraph}>Modifier votre mot de passe</Text>
      <Stack spacing={2} style={{ marginVertical: 8 }}>
        <TextInput
          label="Courriel"
          value={email}
          onChangeText={(text) => setEmail(text)}
          leading={(props) => (
            <MaterialCommunityIcons name="email" {...props} />
          )}
        />
        <Button
          title="Envoyer courriel"
          color={Constants.primary}
          tintColor={Constants.textColor}
          onPress={sendResetEmail}
        />
        <Button
          title="Retour"
          color={Constants.secondary} 
          tintColor={Constants.textColor}
          onPress={() => navigation.navigate('Compte')}
        />
      </Stack>
    </View>
  );
}
