import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid'; // Importez uuid

const db = SQLite.openDatabase('Connexion.db');

//const db = SQLite.openDatabase('Connexion', '2.0', 'Database for Connexion', 1);


//Creation de table de connexion
const createUserTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Connexion (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, email TEXT UNIQUE, password TEXT, admin BOOLEAN);',
        [],
        (_, result) => {
          console.log('Table "Connexion" créée avec succès.');
          console.log('');
          //dropUserTable();  //cela supprimera la table 
          getTableInfo();
          getUsersFromDatabase();
        },
        (_, error) => {
          console.error('Erreur lors de la création de la table "Connexion":', error);
        }
      );
    });
  };
 

// Fonction pour supprimer la table "Connexion"
const dropUserTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'DROP TABLE IF EXISTS Connexion;',
      [],
      (_, result) => {
        console.log('Table "Connexion" supprimée avec succès.');
      },
      (_, error) => {
        console.error('Erreur lors de la suppression de la table "Connexion":', error);
      }
    );
  });
};


// Fonction pour obtenir les informations sur la table "Connexion" (y compris les colonnes)
const getTableInfo = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "PRAGMA table_info(Connexion);",
      [],
      (_, { rows }) => {
        const columns = rows._array.map((row) => row.name); // Extraire les noms des colonnes
        console.log('Colonnes de la table "Connexion":', columns);
        console.log('');
      },
      (_, error) => {
        console.error('Erreur lors de l\'obtention des informations sur la table "Connexion":', error);
      }
    );
  });
};


  //Obtenir les infos de la table  Connexion
  const getUsersFromDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Connexion;',
        [],
        (_, { rows }) => {
          const Users = rows._array; // Convertir les résultats en un tableau JavaScript
          console.log('Utilisateurs dans la table "Connexion":', Users);
        },
        (_, error) => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
      );
    });
  };
  

const isAuthenticated = async () => {
  const tokenInfo = await getData();
  if (tokenInfo && new Date(tokenInfo.expiresIn) > Date.now()) {
    return true;
  }
  return false;
};

const storeData = async (idToken, expiresInSeconds) => {
  const expiresIn = new Date();  
  expiresIn.setSeconds(expiresIn.getSeconds() + expiresInSeconds);

  const value = { idToken, expiresIn };

  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@token', jsonValue);
  } catch (e) {
    // gestion de l'erreur lors de l'enregistrement
  }
};


//A reviser peut etre a supprimer
const signUp = async (email, password) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO Connexion (email, password) VALUES (?, ?);',
          [email, password],
          (_, { insertId }) => {
            resolve({ success: true, idToken: insertId });
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };
  
  

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@token');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // gestion de l'erreur lors de la lecture de la valeur
  }
};

//A reviser peut etre a supprimer
const createUser = (User) => {
    db.transaction((tx) => {
      // Vérifier d'abord si un utilisateur avec la même adresse e-mail existe déjà
      tx.executeSql(
        'SELECT id FROM Connexion WHERE email = ?;',
        [User.email],
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log('Un utilisateur avec la même adresse e-mail existe déjà.');
          } else {
            // Aucun utilisateur avec la même adresse e-mail n'a été trouvé,  insérer le nouvel utilisateur.
            tx.executeSql(
              'INSERT INTO Connexion (first_name, last_name, email, password, admin) VALUES (?, ?, ?, ?, ?);',
              [User.first_name, User.last_name, User.email, User.password, User.admin],
              (_, { insertId }) => {
                console.log('Utilisateur inséré avec succès, ID:', insertId);
              },
              (_, error) => {
                console.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
              }
            );
          }
        },
        (_, error) => {
          console.error('Erreur lors de la vérification de l\'existence de l\'utilisateur :', error);
        }
      );
    });
  };
  
  
//Gestion des connexion et d'inscription
const getCommonError = (code) => {
  switch (code) {
    case 'INVALID_EMAIL':
      return "L'adresse e-mail est mal formatée.";
    case 'MISSING_EMAIL':
      return "L'adresse e-mail est invalide.";
    case 'EMAIL_EXISTS':
      return "L'adresse e-mail est déjà utilisée par un autre Compte.";
    case 'OPERATION_NOT_ALLOWED':
      return 'La connexion par mot de passe est désactivée pour ce projet.';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      return "Nous avons bloqué toutes les demandes de cet appareil en raison d'une activité inhabituelle. Réessayez plus tard.";
    case 'EMAIL_NOT_FOUND':
      return "Il n'y a pas de fiche utilisateur correspondant à cet identifiant. L'utilisateur a peut-être été supprimé.";
    case 'INVALID_PASSWORD':
      return "Le mot de passe est invalide ou l'utilisateur n'a pas de mot de passe.";
    case 'MISSING_PASSWORD':
      return "Le mot de passe est invalide ou l'utilisateur n'a pas de mot de passe.";
    case 'User_DISABLED':
      return 'Le Compte utilisateur a été désactivé par un administrateur.';
    default:
      return `Une erreur inhabituelle s'est produite ! Veuillez réessayer (code: ${code}).`;
  }
};


//Obtenir tous les utilisateurs
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Connexion;',
          [],
          (_, { rows }) => {
            const Users = rows._array; // Récupérer les données sous forme de tableau JavaScript
            resolve(Users);
            console.log('Users :', Users);
          },
          
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };


  const getInitialsFromUsers = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT first_name, last_name FROM Connexion;',
          [],
          (_, { rows }) => {
            const Users = rows._array; // Récupérer les données sous forme de tableau JavaScript
            const initials = Users.map((User) => ({
              first_initial: User.first_name.charAt(0),
              last_initial: User.last_name.charAt(0),
            }));
            resolve(initials);
            console.log('Initials of Users:', initials);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };
  
  
  const isAdmin = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT admin FROM Connexion WHERE id = ?;',
          [], 
          (_, { rows }) => {
            const result = rows.item(0); // Prendre la première ligne de résultat
            if (result && result.admin === 1) {
              // Si la colonne "admin" est à 1, l'utilisateur est un administrateur
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_, error) => {
            console.error('Erreur lors de la vérification du statut d\'administrateur:', error);
            reject(error);
          }
        );
      });
    });
  };
  


    const clearData = async () => {
        try {
          await AsyncStorage.clear()
        } catch(e) { 
          // clear error
        }
      
        console.log('Déconnexion reussi.')
      }
      
  
     
//Fonction pour envoyer un courriel de reinitialisation de mot de passe
      const sendResetPasswordEmail = async (email) => {
        const sendGridApiKey = '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'; //Clé SendGrid
      
        try {
          const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
            personalizations: [
              {
                to: [
                  {
                    email: email,
                  },
                ],
                subject: 'Réinitialisation de mot de passe',
              },
            ],
            from: {
              email: 'lucarbenz@gmail.com',
            },
            template_id: 'd-889b4b52d0764e87b5513c35381fda5f', 
            dynamic_template_data: {
              resetLink: 'Resest_test', 
            },
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sendGridApiKey}`,
            },
          });
      
          if (response.status === 202) {
            console.log('email :', email);
            return { success: true };
          } else {
            return { success: false, error: 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation' };
          }
        } catch (error) {
          console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation :', error);
          return { success: false, error: error.message };
        }
      };
      
      
      //Fonction pour fermer la base de donnée
      const onAppClose = () => {
        db.close((err) => {
          if (err) {
            console.error('Erreur lors de la fermeture de la base de données :', err);
          } else {
            console.log('La base de données a été fermée avec succès.');
          }
        });
      };


export { createUserTable, isAuthenticated, storeData, getData, getCommonError, createUser, 
    isAdmin,signUp,getAllUsers,getInitialsFromUsers,clearData,sendResetPasswordEmail,onAppClose };
