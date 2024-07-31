import * as React from 'react';
import { Text, View,StyleSheet,Pressable,FlatList,Image} from 'react-native';


const Propos = () => {
  
  return (
    <View style>
        <Text style={{fontSize:34}}>Le projet final de mobile 2 a été fait par Luc Arbenz Sévère et Redgy Pérard</Text>
        <Image style={styles.logo} source={{uri:"https://wegotthiscovered.com/wp-content/uploads/2023/03/Predator-Handshake.jpg"}} />
        
    </View>
  ) }
  const styles = StyleSheet.create({
    logo:{    
    width:410,
    height:220,
    paddingBottom: 40,
    paddingTop: 20,
        paddingLeft:20
    },
    imgC: {
        justifyContent: "center",
    alignItems: "center"
    }
  })

export default Propos;