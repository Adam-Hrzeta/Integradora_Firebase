import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../lib/Firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Iniciar sesión con correo y contraseña
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si el correo electrónico está confirmado
      if (user.emailVerified) {
        // Si el correo está verificado, redirigir al usuario a la pantalla principal
        Alert.alert("Bienvenido", "Has iniciado sesión.");
        router.push("/dashboard");
      } else {
        // Si el correo no está verificado, mostrar un mensaje y cerrar sesión
        Alert.alert(
          "Correo no verificado",
          "Por favor, verifica tu correo electrónico antes de iniciar sesión."
        );
        await signOut(auth); // Cerrar sesión para evitar acceso no autorizado
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg' }}
      style={styles.background}
      blurRadius={10}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Inicio de Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#B39DDB"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#B39DDB"
          />
          <Button title="Iniciar Sesión" onPress={handleLogin} color="#7E57C2" />
          <Button title="¿No tienes cuenta? Regístrate" onPress={() => router.push("/register")} color="#B39DDB" />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(46, 39, 57, 0.8)',
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderBottomColor: '#7E57C2',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    color: '#FFF',
  },
});

export default LoginScreen;