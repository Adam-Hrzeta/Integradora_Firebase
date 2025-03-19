import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { AntDesign, FontAwesome5, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Actualizar el estado si el usuario ha iniciado sesión
    });

    return () => unsubscribe(); // Limpiar la suscripción
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            width: "60%",
            height: "23%",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Inicio",
            title: "Inició de sesión",
            drawerIcon: ({ color, size }) => (
              <AntDesign name="home" size={24} color="black" />
            ),
          }}
        />

        <Drawer.Screen
          name="(profile)"
          options={{
            drawerLabel: "Mi Perfil",
            title: "Mi Perfil de usuario",
            drawerIcon: ({ color, size }) => (
              <Fontisto name="person" size={24} color="#000000" />
            ),
            drawerItemStyle: isLoggedIn ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(parkings)"
          options={{
            drawerLabel: "Lotes disponibles",
            title: "Lotes disponibles",
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="parking" size={24} color="#000000" />
            ),
            drawerItemStyle: isLoggedIn ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(messages)"
          options={{
            drawerLabel: "Mensajes",
            title: "Mensajes",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="message" size={24} color="#000000" />
            ),
            drawerItemStyle: isLoggedIn ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(auth)"
          options={{
            title: "Credenciales de usuario",
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}