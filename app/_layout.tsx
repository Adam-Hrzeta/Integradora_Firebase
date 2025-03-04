import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { AntDesign, FontAwesome5, Fontisto } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            width: '60%', // Ajusta el ancho del drawer (puedes usar porcentaje o valores fijos)
            height: '20%',
          },
        }}
      >
        <Drawer.Screen
          name="index" // Ruta de inicio
          options={{
            drawerLabel: 'Inicio',
            title: 'Pantalla de bienvenida',
            drawerIcon: ({ color, size }) => (
              <AntDesign name="home" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="(profile)" // Ruta de perfil
          options={{
            drawerLabel: 'Perfil de usuario',
            title: 'Perfil de usuario',
            drawerIcon: ({ color, size }) => (
              <Fontisto name="person" size={24} color="#000000" />
            ),
          }}
        />
        <Drawer.Screen
          name="(parkings)" // Ruta de lotes disponibles
          options={{
            drawerLabel: 'Lotes disponibles',
            title: 'Lotes disponibles',
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="parking" size={24} color="#000000" />
            ),
          }}
        />
        {/* Ocultar rutas no deseadas, como (auth) */}
        <Drawer.Screen
          name="(auth)"
          options={{
            title: 'Credenciales de usuario',
            drawerItemStyle: { display: 'none' }, // Oculta esta ruta en el drawer
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}