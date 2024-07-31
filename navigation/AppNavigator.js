import React, { useState, useEffect,useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProduitsScreen from "../screens/ProduitsScreen";
import GestionProduitsScreen from "../screens/GestionProduitsScreen";
import CompteScreen from "../screens/CompteScreen";
import InscriptionScreen from "../screens/InscriptionScreen";
import AdminScreen from "../screens/AdminScreen";
import UserScreen from "../screens/UserScreen";
import EditScreen from "../screens/EditScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import LocationScreen from "../screens/LocationScreen";
import { GameContext } from "../screens/GameContext";
import Propos from "../screens/Propos";
import Panier from "../screens/Panier";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("Connexion.db");

const Tab = createBottomTabNavigator();


const AppNavigator = () => {
  const [listProduits, setProduits] = useState([]);
  const [cart, setCart] = useState([]);
  const [nom,setNom] = useState();
  const [badge,setBadge] = useState(0);
  return (
    <GameContext.Provider value={{listProduits,setProduits,cart,setCart,nom,setNom,badge,setBadge}}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "ResetPassword") {
              iconName = focused ? "cog" : "cog-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Compte"
          component={CompteScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Login",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="sign-in" color={color} size={size} />
            ),
          }}
        />

<Tab.Screen
          name="Entrepôts"
          component={LocationScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name="business"
                size={size}
                color={focused ? "green" : "lightblue"}
              />
            ),
          }}
        />
        

        <Tab.Screen
          name="Produits"
          component={ProduitsScreen}
          options={() => ({
            tabBarButton: () => null,
            tabBarVisible: false,
            headerShown: false,
            tabBarLabel: "Produits",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-basket" color={color} size={size} />
            ),
          })}
        />

        

        <Tab.Screen
          name="User"
          component={UserScreen}
          options={() => ({
            tabBarButton: () => null,
            tabBarVisible: false,
            headerShown: false,
            tabBarLabel: "Gestion des utilisateurs",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" color={color} size={size} />
            ),
          })}
        />

        <Tab.Screen
          name="Gestion des Produits"
          component={GestionProduitsScreen}
          options={() => ({
            tabBarButton: () => null,
            tabBarVisible: false,
            headerShown: false,
            tabBarLabel: "Gestion des produits",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-basket" color={color} size={size} />
            ),
          })}
        />
       

        <Tab.Screen
          name="Inscription"
          component={InscriptionScreen}
          options={{
            tabBarButton: () => null,
            tabBarVisible: false,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Edit"
          component={EditScreen}
          options={{
            tabBarButton: () => null,
            tabBarVisible: false,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{
            tabBarButton: () => null,
            tabBarVisible: false,
            headerShown: false,
          }}
        />


        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarButton: () => null,
            tabBarVisible:false,
            headerShown: false,
            tabBarLabel: "Admin",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="lock" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Panier"
          component={Panier}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name="cart"
                size={size}
                color={focused ? "green" : "lightblue"}
              />
            ),
            tabBarBadge:badge
          }}
        />


         <Tab.Screen
          name="À propos"
          component={Propos}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name="chatbubbles-outline"
                size={size}
                color={focused ? "green" : "lightblue"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </GameContext.Provider>
  );
};

export default AppNavigator;
