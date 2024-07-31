import React, { useEffect, useState,useContext } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import Constants from "../Constants";
import { Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { produits } from "../produits";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameContext } from "../screens/GameContext";

const db = SQLite.openDatabase("products");


const GestionProduitsScreen = ({navigation}) => {
  const {listProduits, setProduits} = useContext(GameContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [jeuNom, setJeuNom] = useState("");
  const [jeuPrice, setJeuPrice] = useState("");
  const [jeuImg, setJeuImg] = useState(
    "https://upload.wikimedia.org/wikipedia/en/d/de/Lies_of_p_cover_art.jpg"
  );
  const [jeuDescription, setJeuDescription] = useState("Jeu video");

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    createT();
    getProduits();
  }, []);

  const getProduits = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM product ORDER BY id DESC",
        [],
        (sqlTxn, res) => {
          let len = res.rows.length;

          if (len > 0) {
            let results = [];

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);

              results.push({
                id: item.id,
                name: item.name,
                img: item.img,
                price: item.price,
                description: item.description,
              });
            }
            setProduits(results);
          }
        }
      );
    });
  };

  const addProducts = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO product (name,img,price,description) VALUES (?,?,?,?)",
        [jeuNom, jeuImg, jeuPrice, jeuDescription],
        (sqlTxn, res) => {
          console.log("Game added", res);
          getProduits();
        },
        (error) => {
          console.log("error");
        }
      );
    });
    setModalVisible(false);
  };

  const createT = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,img TEXT,price DECIMAL(8,2),description TEXT )",
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
        },
        (error) => {
          console.log("erreur on creating table: ");
        }
      );
    });
  };

  const removeTable = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM product WHERE id=(?)",
        [id],
        (sqlTxn, res) => {
          console.log("Jeu Supprimé");
          getProduits();
        },
        (error) => {
          console.log("Erreur lors de la suppression");
        }
      );
    });
  };

  const ajouter = () => {
    addProducts();
  };


  return (
    <View style={styles.container}>
      <View style={styles.background2}>
      <Pressable style={styles.bouttonRetour}>
          <Text style={{color:"white",textAlign:"center"}} onPress={() => navigation.navigate('Admin')}>Retour</Text>
        </Pressable>
        <Text style={styles.titre}>
          Bienvenue dans la page gestion des Produits
        </Text>
        <View style={styles.header}>      
      </View>
        <Modal visible={modalVisible}>
          <View style={{ flex: 1, backgroundColor: "lightblue" }}>
            <Text style={styles.detailsNom2}>Ajout d'un jeu</Text>
            <Text style={styles.modalText}>Nom du jeu :</Text>
            <TextInput
              style={styles.input}
              onChangeText={(txt) => setJeuNom(txt)}
              value={jeuNom}
              placeholder="Nom du jeu"
            />
            <Text style={styles.modalText}>Prix du jeu :</Text>
            <TextInput
              style={styles.input}
              onChangeText={(txt) => setJeuPrice(txt)}
              value={jeuPrice}
              keyboardType="numeric"
              placeholder="Prix du jeu"
            />
            <Text style={styles.modalText}>Image du jeu :</Text>
            <TextInput
              style={styles.input}
              onChangeText={(txt) => setJeuImg(txt)}
              value={jeuImg}
              placeholder="URL de l'image"
            />
            <Text style={styles.modalText}>Description du jeu :</Text>
            <TextInput
              style={styles.input}
              onChangeText={(txt) => setJeuDescription(txt)}
              value={jeuDescription}
              placeholder="Description du jeu"
            />
            <Pressable style={styles.bouttonValider} onPress={ajouter}>
              <Text style={styles.text2}>Ajouter</Text>
            </Pressable>
            <Pressable
              style={styles.bouttonValider}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.text2}>Fermer</Text>
            </Pressable>
          </View>
        </Modal>
        <Pressable
          style={styles.bouttonValider}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.text2}>Ajouter</Text>
        </Pressable>
        <FlatList
          data={listProduits}
          renderItem={({ item }) => (
            <ScrollView contentContainerStyle={styles.centrerImg}>
              <Image source={{ uri: item.img }} style={styles.avatar} />
              <Text style={styles.centrer2}>Nom du jeu: {item.name}</Text>

              <Text style={styles.centrer2}>Prix: {item.price}$</Text>
              <Pressable
                style={styles.bouttonValider}
                onPress={() => removeTable(item.id)}
              >
                <Text style={styles.text2}>Supprimer</Text>
              </Pressable>
            </ScrollView>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: "3%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    right: "20%",
    bottom: "83%",
  },
  titre: {
    fontSize: 20,
    marginBottom: 20,
  },
  imageLogo: {
    position: "absolute",
    top: "3%",
    left: "4%",
    width: "15%",
    height: "4%",
  },
  barreRecherche: {
    position: "absolute",
    top: "3%",
    left: "23%",
    paddingLeft: 10,
    width: "53%",
    height: "4%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  iconeProfil: {
    position: "absolute",
    top: "3.5%",
    left: "80%",
  },
  iconePanier: {
    position: "absolute",
    top: "3.5%",
    left: "88.5%",
  },
  btn: {
    height: 20,
    width: 115,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 28,
  },
  centrer: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  centrer2: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  avatar: {
    width: 100,
    height: 125,
    margin: 5,
  },
  centrerImg: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "red",
    borderBottomWidth: 3,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
    flexGrow: 1,
  },
  background: {
    backgroundColor: "yellow",
  },
  background2: {
    backgroundColor: "teal",
  },
  bouttonValider: {
    marginTop: 20,
    height: 30,
    width: 120,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: "center",
    backgroundColor: "orange",
    textAlign: "center",
  },
  text2: {
    textAlign: "center",
  },
  detailsNom: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 30,
  },
  detailsNom2: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 20,
  },
  detailsImage: {
    height: "50%",
    width: "70%",
    marginBottom: 25,
    marginTop: 5,
  },
  detailBG: {
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailBG2: {
    backgroundColor: "red",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  modalText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    right:"21%",
    top:"3%",
  },
  bouttonRetour: {
    marginTop: 20,
    height: 30,
    width: 120,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: "center",
    backgroundColor: "#1583FF",
    textAlign: "center",
  },
});


export default GestionProduitsScreen;
 




