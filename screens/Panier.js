import React, { useState,useContext,useEffect} from 'react';
import { Text, View,StyleSheet,Pressable,FlatList,Image,ScrollView,Alert,Button} from 'react-native';
import { GameContext } from "../screens/GameContext";


const Panier = ({navigation}) => {

  const {badge, setBadge} = useContext(GameContext);
  const {cart,setCart} = useContext(GameContext);
 
    const removeCart = (item) => {
        const isItemInCart = cart.find((cartItem) => cartItem.id === item.id);
    
        if (isItemInCart.quantity === 1) {
          setCart(cart.filter((cartItem) => cartItem.id !== item.id)); //si la quantite de l'item est de 1, enleve l'item du panier
          setBadge(badge-1);
        } else {
          setCart(
            cart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 } //si la quantite est plus haut que 1, reduit la quantite de l'item
                : cartItem
            )
          );
          setBadge(badge-1);
        }
      };
    
      const clearCart = () => {
        setCart([]); //vide la liste de produit dans le panier
        setBadge([]);
      };
    
      const totalCart = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0); //calcul le total de $ des items dans la panier
      };
    

  return (
    <View style>
        <Text style={styles.detailsNom}>Panier de l'utilisateur</Text>
        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <ScrollView contentContainerStyle={styles.centrerImg}>
              <Image source={{ uri: item.img }} style={styles.avatar} />
              <Text style={styles.centrer2}>Nom du jeu: {item.name}</Text>
              <Text style={styles.centrer2}>Prix: {item.price}$</Text>
              <Text style={styles.centrer2}>Qté : {item.quantity}</Text>
              <Pressable
                style={styles.bouttonValider2}
                onPress={() => removeCart(item)}
              >
                <Text style={styles.text2}>-</Text>
              </Pressable>
            </ScrollView>
          )}
          keyExtractor={(item) => item.id}
        />
        <Text style={styles.centrer2}>Total : {totalCart().toFixed(2)} $</Text>
        <Pressable style={styles.bouttonValider} onPress={() => clearCart()}>
          <Text style={styles.text2}>Vider panier</Text>
        </Pressable>
        <Pressable
          style={styles.bouttonValider}
          onPress={() => Alert.alert(
            'Achat Final',
            `Le total de votre achat est de ${totalCart()} $. La livraison se fera le plus rapidement possible. Merci d'avoir magasiner chez nous`, //Alerte pour afficher la confirmation d'achat
            [
              {text: 'OK', onPress: clearCart()},
            ],
            { cancelable: false }
          )}
        >
          <Text style={styles.text2}>Acheter</Text>
        </Pressable>
    </View>

    
  )
  
 }
  const styles = StyleSheet.create({
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
      bouttonValider2: {
        marginTop: 20,
        height: 30,
        width: 40,
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
      centrer2: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700",
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
      avatar: {
        width: 100,
        height: 125,
        margin: 5,
      },
  })

export default Panier;