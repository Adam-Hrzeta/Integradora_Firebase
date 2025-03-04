import React, { useState } from "react";
import { 
  View, TextInput, Text, Alert, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  ImageBackground, TouchableOpacity 
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importa Picker
import { useRouter } from "expo-router";

const RegisterScreenVehicle = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carBrand, setCarBrand] = useState(""); // Marca del vehículo
  const [year, setYear] = useState("2025"); // Año por defecto
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleRegisterVehicle = () => {
    if (!licensePlate || !carModel || !carBrand) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    Alert.alert("Vehículo registrado", "Tu vehículo ha sido registrado correctamente.");
    router.push("/login"); // Redirige al inicio o donde sea necesario
  };

  return (
    <ImageBackground
      source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg" }}
      style={styles.background}
      blurRadius={10}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro de Vehículo</Text>
          
          {/* Campo Placa */}
          <TextInput
            style={[styles.input, focusedInput === "licensePlate" && styles.inputFocused, styles.boldText]}
            placeholder="Placa (máx. 9 caracteres)"
            value={licensePlate}
            onChangeText={(text) => setLicensePlate(text.slice(0, 9))}
            autoCapitalize="characters"
            placeholderTextColor="#7E57C2"
            onFocus={() => setFocusedInput("licensePlate")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Campo Modelo */}
          <TextInput
            style={[styles.input, focusedInput === "carModel" && styles.inputFocused, styles.boldText]}
            placeholder="Modelo del vehículo"
            value={carModel}
            onChangeText={setCarModel}
            autoCapitalize="words"
            placeholderTextColor="#7E57C2"
            onFocus={() => setFocusedInput("carModel")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Campo Marca */}
          <TextInput
            style={[styles.input, focusedInput === "carBrand" && styles.inputFocused, styles.boldText]}
            placeholder="Marca del vehículo"
            value={carBrand}
            onChangeText={setCarBrand}
            autoCapitalize="words"
            placeholderTextColor="#7E57C2"
            onFocus={() => setFocusedInput("carBrand")}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Selector de Año */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Año</Text> {/* Etiqueta centrada para el campo de año */}
            <Picker
              selectedValue={year}
              onValueChange={(itemValue: React.SetStateAction<string>) => setYear(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona el año" value="" /> {/* Placeholder */}
              {Array.from({ length: 2025 - 1950 + 1 }, (_, i) => (
                <Picker.Item key={i} label={`${1950 + i}`} value={`${1950 + i}`} />
              ))}
            </Picker>
          </View>

          {/* Botón Registrar Vehículo */}
          <TouchableOpacity style={styles.button} onPress={handleRegisterVehicle}>
            <Text style={styles.buttonText}>Registrar Vehículo</Text>
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
    width: "85%", // Reducido el ancho
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
    justifyContent: "center",
  },
  inputFocused: {
    backgroundColor: "#D1C4E9",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  pickerContainer: {
    backgroundColor: "#C8AAAA",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden", // Para recortar el exceso de bordes
    width: "80%", // Reducido el ancho del Picker
    alignSelf: "center", // Centra el Picker
    borderWidth: 1,
    borderColor: "#7E57C2",
    paddingVertical: 5, // Agregado padding para mayor espacio
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
    textAlign: "center", // Centrado de la etiqueta "Año"
  },
  picker: {
    height: 50,  // Ajustado para que se vea más limpio
    color: "#000000",
    width: "100%", // Asegura que el Picker ocupe todo el ancho
    justifyContent: "center", // Centra los elementos dentro del Picker
    textAlign: "center", // Centra el texto dentro del Picker
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
});

export default RegisterScreenVehicle;
