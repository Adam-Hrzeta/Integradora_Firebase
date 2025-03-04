import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { AntDesign, FontAwesome5, Fontisto } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario ha iniciado sesión
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
            width: "60%", // Ajusta el ancho del drawer (puedes usar porcentaje o valores fijos)
            height: "22%",
          },
        }}
      >
        {/* Ruta de inicio (siempre visible) */}
        <Drawer.Screen
          name="index" // Ruta de inicio
          options={{
            drawerLabel: "Inicio",
            title: "Pantalla de bienvenida",
            drawerIcon: ({ color, size }) => (
              <AntDesign name="home" size={24} color="black" />
            ),
          }}
        />

        {/* Ruta de perfil (oculta si el usuario no ha iniciado sesión) */}
        <Drawer.Screen
          name="(profile)" // Ruta de perfil
          options={{
            drawerLabel: "Perfil de usuario",
            title: "Perfil de usuario",
            drawerIcon: ({ color, size }) => (
              <Fontisto name="person" size={24} color="#000000" />
            ),
            drawerItemStyle: isLoggedIn ? {} : { display: "none" }, // Ocultar si no ha iniciado sesión
          }}
        />

        {/* Ruta de lotes disponibles (oculta si el usuario no ha iniciado sesión) */}
        <Drawer.Screen
          name="(parkings)" // Ruta de lotes disponibles
          options={{
            drawerLabel: "Lotes disponibles",
            title: "Lotes disponibles",
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="parking" size={24} color="#000000" />
            ),
            drawerItemStyle: isLoggedIn ? {} : { display: "none" }, // Ocultar si no ha iniciado sesión
          }}
        />

        {/* Ocultar rutas no deseadas, como (auth) */}
        <Drawer.Screen
          name="(auth)"
          options={{
            title: "Credenciales de usuario",
            drawerItemStyle: { display: "none" }, // Oculta esta ruta en el drawer
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}