import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Stack, TextInput, Button } from "@react-native-material/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "../Constants";
import {
  isAuthenticated,
  signUp,
  getCommonError,
  createUserTable,
  createUser,
} from "../services/userService";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("Connexion.db");

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    createUserTable();
    (async () => {
      const isUserAuthenticated = await isAuthenticated();
      if (isUserAuthenticated) {
        navigation.navigate("Produits");
      }
    })();
  }, []);

  const createAccount = () => {
    if (validateName() && validateEmail() && validatePassword()) {
      setErrorMessage(""); // Effacez les messages d'erreur précédents

      // Vérifiez d'abord si l'e-mail existe déjà dans la base de données
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) as count FROM Connexion WHERE email = ?;",
          [email],
          (_, { rows }) => {
            const count = rows.item(0).count;

            if (count > 0) {
              // L'e-mail existe déjà, affichez une erreur
              setErrorMessage("L'e-mail existe déjà.");
            } else {
              // L'e-mail n'existe pas encore, insérez l'utilisateur dans la base de données SQLite
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO Connexion (first_name, last_name, email, password) VALUES (?, ?, ?, ?);",
                  [firstName, lastName, email, password],
                  (_, result) => {
                    console.log("Utilisateur inséré avec succès.", result);
                    //loadUsers(); // Chargez à nouveau la liste des utilisateurs
                    navigation.navigate("Compte");
                  },
                  (_, error) => {
                    console.error(
                      "Erreur lors de l'insertion de l'utilisateur:",
                      error
                    );
                    setErrorMessage(
                      "Une erreur s'est produite lors de la création du Compte."
                    );
                  }
                );
              });
            }
          },
          (_, error) => {
            console.error(
              "Erreur lors de la vérification de l'existence de l'e-mail:",
              error
            );
            setErrorMessage(
              "Une erreur s'est produite lors de la création du Compte."
            );
          }
        );
      });
    }
  };

  const validateName = () => {
    if (!firstName || firstName.length < 2) {
      setErrorMessage("Le prénom doit contenir au moins deux caractères.");
      return false;
    }

    if (!lastName || lastName.length < 2) {
      setErrorMessage("Le nom doit contenir au moins deux caractères.");
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email || email.length < 1 || !emailPattern.test(email)) {
      setErrorMessage("Adresse e-mail invalide");
      return false;
    }

    return true;
  };

  //dfs

  const validatePassword = () => {
    if (password !== confirmation) {
      setErrorMessage("Les mots de passe ne sont pas identiques.");
      return false;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Le mot de passe est trop court.");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/Boutique.png")} />
      <View style={{ marginTop: 10 }}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
      <Stack spacing={2} style={{ margin: 8 }}>
        <TextInput
          label="Prénom"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          leading={(props) => (
            <MaterialCommunityIcons name="account" {...props} />
          )}
        />
        <TextInput
          label="Nom"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          leading={(props) => (
            <MaterialCommunityIcons name="account" {...props} />
          )}
        />
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
        <TextInput
          label="Confirmer mot de passe"
          secureTextEntry
          value={confirmation}
          onChangeText={(text) => setConfirmation(text)}
          leading={(props) => (
            <MaterialCommunityIcons name="form-textbox-password" {...props} />
          )}
        />
        <Button
          title="Créer mon Compte"
          color={Constants.primary}
          tintColor={Constants.textColor}
          onPress={createAccount}
        />

        <Button
          title="Retour"
          color={Constants.secondary}
          tintColor={Constants.textColor}
          onPress={() => navigation.navigate("Compte")}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    top: "3%",
  },
  logo: {
    height: "30%",
    width: "50%",
  },
  errorText: {
    color: "red",
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 10,
  },
});
