import React, { useState,useContext} from 'react';
import { View, Text, StyleSheet,Button,Image,FlatList,Pressable,Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  clearData
} from '../services/userService';
import { GameContext } from "../screens/GameContext";


let text = "";
let image = "https://as2.ftcdn.net/v2/jpg/05/56/12/35/1000_F_556123567_nGKtU1Guwylri1fvxLLcd2z9O1Ol0hYT.jpg";
let nom = "";
let prix =  0;

const ProduitsScreen = ({ navigation }) => {
  
  const {listProduits, setProduits} = useContext(GameContext);
  const {cart,setCart} = useContext(GameContext);
  const [modalVisible, setModalVisible] = useState(false);
  const {badge, setBadge} = useContext(GameContext);
  
  const logout =  async () => {
    await clearData();
    navigation.navigate('Compte'); 
    setBadge(0);
    setCart([]);
  };
  
/**
 * ajoute un item a la carte
 * @param {*} item 
 */
const ajouterCart = (item) => {
  const isItemInCart = cart.find((cartItem) => cartItem.id === item.id); //regarde si l'item est deja dans le panier

  if (isItemInCart) {
    setCart(
      cart.map(
        (
          cartItem //si l'item est dans le panier, augmente la quantite de l'item
        ) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem //sinon, retourne l'item
      )
      
    );
    setBadge(badge + 1);
   
  } else {
    setCart([...cart, { ...item, quantity: 1 }]); //si l'item n'est pas dans la carte, ajoute l'item dans le panier
    setBadge(badge +1);
   
    console.log(JSON.stringify(cart));
  }
  console.log(JSON.stringify(cart));
};

//Variable globale stock les valeurs des jeux pour le modal
const Details = (n,i,p,description) => {
 nom = n;
 image = i;
 text = description;
 prix = p;
 setModalVisible(true); 
};

const FermerDetails = () => {
 setModalVisible(false);
}

 
  return ( 
    <View style={styles.container}>    
      <Button title="Déconnexion" onPress={logout} />
      <Text style={styles.titre}> Bienvenue dans la page Produits</Text>
      <Modal visible={modalVisible}>
        <View style={{ flex: 1, backgroundColor: "lightblue", alignContent:"center" }}> 
        <Text style={styles.detailsNom}>{nom}</Text>
        <Image source={{ uri: image }} style={{height:400,width:"100%"}} /> 
        <Text style={{fontSize:21,textAlign:"center"}}> {prix} $ </Text>
        <Text style={{fontSize:21}}>Description du jeu : </Text>
        <Text style={styles.detailText}>{text}</Text>
        <Pressable
                style={styles.bouttonValider}
                onPress={() =>FermerDetails()
                }
              >
                <Text style={styles.text2}>Fermer</Text>
              </Pressable>
        </View>
      </Modal>
      <FlatList
          data={listProduits}
          renderItem={({ item }) => (
            <View style={styles.centrerImg}>
              <Image source={{ uri: item.img }} style={styles.avatar} />
              <Text style={styles.centrer2}>Nom du jeu: {item.name}</Text>
              <Text style={styles.centrer2}>Prix: {item.price}$</Text>
              <Pressable
                style={styles.bouttonValider}
                onPress={() =>Details(item.name,item.img,item.price,item.description)
                }
              >
                <Text style={styles.text2}>Plus de détails</Text>
              </Pressable>

              <Pressable
                style={styles.bouttonValider}
                onPress={() => ajouterCart(item)}
              >
                <Text style={styles.text2}>Ajoutez au panier</Text>
              </Pressable>
              <Pressable
                style={styles.bouttonValider}
                onPress={() => navigation.navigate("Panier")}
              >
                <Text style={styles.text2}>Aller au panier</Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '3%',
    backgroundColor: "yellow",
  },
  titre: {
    fontSize: 20,
    marginBottom: 20,
  },
  imageLogo: {
    position: 'absolute',
    top: '3%',
    left: '4%',
    width:'15%',
    height:'4%',
  },
  barreRecherche: {
    position: 'absolute',
    top: '3%',
    left: '23%',
    paddingLeft: 10,
    width: '53%',
    height: '4%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  iconeProfil: {
    position: 'absolute',
    top: '3.5%',
    left: '80%',
  },
  iconePanier: {
    position: 'absolute',
    top: '3.5%',
    left: '88.5%',
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
  btn: {
    height: 20,
    width: 115,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
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
  detailBG: {
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailBG2: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    
  },
  detailsNom: {
    textAlign: "center",
    fontSize: 38,
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
    width: 500,
    marginBottom: 25,
    marginTop: 5,
  },
  detailText: {
    color: "white",
    fontSize: 21,
    fontWeight: "700",
  },
});

export default ProduitsScreen;
