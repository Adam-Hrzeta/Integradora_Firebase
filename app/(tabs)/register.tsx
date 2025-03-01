import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../lib/Firebase";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // Nuevo estado para el displayName
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Registrar al usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Actualizar el perfil del usuario con el displayName
      await updateProfile(userCredential.user, {
        displayName: displayName, // Aquí se agrega el displayName
      });

      // Enviar correo de verificación
      await sendEmailVerification(userCredential.user);

      // Mostrar alerta y redirigir al login
      Alert.alert("Cuenta creada", "Se ha enviado un correo de verificación. Revisa tu bandeja.");
      router.push("/login");
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
          <Text style={styles.title}>Registro</Text>
          {/* Nuevo campo para el displayName */}
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            placeholderTextColor="#B39DDB"
          />
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
          <Button title="Registrarse" onPress={handleRegister} color="#7E57C2" />
          <Button title="¿Ya tienes cuenta? Inicia Sesión" onPress={() => router.push("/login")} color="#B39DDB" />
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

export default RegisterScreen;