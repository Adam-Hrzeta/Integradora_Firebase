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
      router.push("/registerVehicle");
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
            placeholderTextColor="#B39DDB"
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
            placeholderTextColor="#B39DDB"
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
            placeholderTextColor="#B39DDB"
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Botón Registrarse */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Botón para iniciar sesión */}
          <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/")}>
            <Text style={styles.registerButtonText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  inputFocused: {
    borderBottomColor: "#B39DDB", // Cambia el color del borde cuando está enfocado
  },
  button: {
    backgroundColor: "#7E57C2",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    alignItems: "center",
  },
  registerButtonText: {
    color: "#7E57C2",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RegisterScreen;