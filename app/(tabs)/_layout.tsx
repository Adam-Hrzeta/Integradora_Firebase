import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Pantalla de bienvenida',
          }}
        />
        <Drawer.Screen
          name="register" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Registrarme',
            title: 'Registro de usuario',
          }}
        />
        <Drawer.Screen
          name="login" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Iniciar sesión',
            title: 'Iniciar sesión',
          }}
        />
        <Drawer.Screen
          name="dashboard" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Estacionamiento',
            title: 'Estacionamiento',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
