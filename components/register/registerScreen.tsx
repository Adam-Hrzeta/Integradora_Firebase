import React, { useState } from "react";
import { 
  View, TextInput, Button, Text, Alert, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  ImageBackground, TouchableOpacity 
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Registrar usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      // Enviar correo de verificación
      await sendEmailVerification(userCredential.user);

      Alert.alert("Cuenta creada", "Se ha enviado un correo de verificación. Ahora registra tu vehículo.");

      // Redirigir al formulario de registro de vehículo
      router.push("/register-vehicle");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg" }}
      style={styles.background}
      blurRadius={10}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro</Text>
          
          {/* Campo Nombre Completo */}
          <TextInput
            style={[styles.input, focusedInput === "displayName" && styles.inputFocused]}
            placeholder="Nombre completo"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            placeholderTextColor="#7E57C2"
            onFocus={() => setFocusedInput("displayName")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Campo Correo Electrónico */}
          <TextInput
            style={[styles.input, focusedInput === "email" && styles.inputFocused]}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#7E57C2"
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Campo Contraseña */}
          <TextInput
            style={[styles.input, focusedInput === "password" && styles.inputFocused]}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#7E57C2"
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Botón Registrarse */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Botón para iniciar sesión */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#000",
  },
  inputFocused: {
    backgroundColor: "#D1C4E9",
  },
  button: {
    backgroundColor: "#7E57C2",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#B39DDB",
    textAlign: "center",
    marginTop: 15,
  },
});

export default RegisterScreen;
