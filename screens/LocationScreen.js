import React from 'react';
import { useState } from "react";
import { View, Text,StyleSheet,FlatList,Pressable} from 'react-native';
import MapView from "react-native-maps";
import { Marker, Polygon } from "react-native-maps";
import coordonnees from "../coordonnees.json"


const points = [
    {
      latitude: 45.642437463656,
      longitude: -73.842384172169,
    },
    {
      latitude: 15.6762,
      longitude: 19.6503,
    },
  ];
  
  const Coordonnee=({coor, idPressed, setIdPressed})=> { 
    return <Pressable style={idPressed == coor.id?[styles.pressable, styles.pressed]:styles.pressable}
      onPressIn={()=>setIdPressed(coor.id)}     >
      <Text style={styles.boulangerie_text}>{coor.nom}</Text>
      <Text style={styles.boulangerie_text}>{coor.description}</Text>
    </Pressable>
  } 
  


const LocationScreen = ({navigation}) => {
    const [idPressed, setIdPressed] = useState(-1);
    return (
        <View style={{ flex: 1 }}>
        <Text style={styles.titre}>Coordonnée des entrepôts</Text>
        <FlatList
            data={coordonnees}
            renderItem={({ item }) => <Coordonnee coor={item} idPressed={idPressed} setIdPressed={setIdPressed}  />}
          />
        <MapView style={{ width: "100%", height: "100%" }}>
          <Polygon coordinates={points} strokeColor="red" strokeWidth={20} />
          {coordonnees.map(b=> <Marker key={b.id} 
            title={b.nom} description={b.description} coordinate={b.coord} onPress={()=>setIdPressed(b.id)}/>)}
        </MapView>
      </View>
    );
}


const styles = StyleSheet.create({
    titre: {
        fontSize: 25,
        alignItems:'center', 
        padding:8
      },
      pressable: {
        backgroundColor: "hsl(38, 100%, 50%)",
        padding : 8,
        margin : 5,
        borderRadius: 10
      },
      pressed: {
        backgroundColor: "hsl(50, 100%, 50%)",
      },
      boulangerie_text: {
        color:"white",
        fontWeight: "bold",
        fontSize: 15
      },

})

export default LocationScreen;