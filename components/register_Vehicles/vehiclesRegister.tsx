import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { VehiclesDataSource } from "../vehicles/dataSource/vehicles_dataSource";
import { Vehicle } from "../vehicles/entities/vehicle";

const RegisterVehicleScreen = () => {
  const [brand, setBrand] = useState<string>("");
  const [licence, setLicence] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert("Error", "Ningún usuario ha iniciado sesión.");
      return;
    }

    // Crear el objeto Vehicle con los datos del formulario
    const vehicle: Vehicle = {
      id: `${user.uid}-${Date.now()}`, // Usamos una combinación del ID de usuario y un timestamp para generar un ID único
      brand,
      licence,
      model,
      year: parseInt(year), // Convertir a número
    };

    try {
      const dataSource = new VehiclesDataSource();
      await dataSource.getUserVehicle(user.uid, vehicle); // Guardar el vehículo en la base de datos

      Alert.alert("Success", "Vehicle registered successfully!");
      router.push("/login"); // Redirigir al login después de registrar el vehículo
    } catch (error) {
      Alert.alert("Error", "Failed to register vehicle.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Vehicle</Text>
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Licence"
        value={licence}
        onChangeText={setLicence}
      />
      <TextInput
        style={styles.input}
        placeholder="Model"
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <Button title="Register Vehicle" onPress={handleSubmit} color="#7E57C2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default RegisterVehicleScreen;
