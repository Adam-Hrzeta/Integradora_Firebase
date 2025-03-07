import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

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
        //Alert.alert("Bienvenido", "Has iniciado sesión."); alerta que notifica
        router.push("/parkings");
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
      source={{
        uri: "https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg",
      }}
      style={styles.background}
      blurRadius={10}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Inicio de Sesión</Text>

          {/* Campo Correo Electrónico */}
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#B39DDB"
          />

          {/* Campo Contraseña */}
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#B39DDB"
          />

          {/* Botón Iniciar Sesión */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Botón Registrarse (solo texto) */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerButtonText}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    backgroundColor: "rgba(46, 39, 57, 0.8)",
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderBottomColor: "#7E57C2",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    color: "#FFF",
  },
  button: {
    backgroundColor: "#7E57C2",
    paddingVertical: 12,
    borderRadius: 25, // Bordes más redondeados
    alignItems: "center",
    marginBottom: 15, // Espacio entre botones
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    alignItems: "center", // Centrar el texto
  },
  registerButtonText: {
    color: "#7E57C2", // Texto morado
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;