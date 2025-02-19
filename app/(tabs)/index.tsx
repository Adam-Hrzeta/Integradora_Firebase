import React from "react";
import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg' }}
      style={styles.background}
      blurRadius={10}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Por favor, selecciona una opción para continuar</Text>
          <View style={styles.buttonContainer}>
            <Button title="Iniciar Sesión" onPress={() => router.push("/login")} color="#7E57C2" />
            <View style={styles.buttonSpacer} />
            <Button title="Registrarse" onPress={() => router.push("/register")} color="#B39DDB" />
          </View>
        </View>
      </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonSpacer: {
    height: 10,
  },
});

export default WelcomeScreen;