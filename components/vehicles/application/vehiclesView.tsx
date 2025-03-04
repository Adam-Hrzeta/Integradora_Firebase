import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { VehiclesDataSource } from "../dataSource/vehicles_dataSource"; // Importa tu datasource
import { Vehicle } from "../entities/vehicle"; // Importa la entidad Vehicle
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importa Firebase Auth

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Estado para almacenar los vehículos
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    const auth = getAuth();

    // Escuchar cambios en la autenticación del usuario
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const dataSource = new VehiclesDataSource();
          const vehiclesData = await dataSource.getUserVehicle(user.uid); // Obtener vehículos del usuario
          setVehicles(vehiclesData); // Actualizar el estado con los vehículos
          setError(null); // Limpiar errores
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setError("Error al cargar los vehículos. Inténtalo de nuevo."); // Mostrar mensaje de error
        } finally {
          setLoading(false); // Finalizar el estado de carga
        }
      } else {
        console.error("❌ No user logged in");
        setError("No hay un usuario autenticado."); // Mostrar mensaje de error
        setLoading(false); // Finalizar el estado de carga
      }
    });

    return () => unsubscribe(); // Limpiar la suscripción al desmontar el componente
  }, []);

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Mostrar un mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Mostrar la lista de vehículos
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de tus Vehículos registrados</Text>
      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.vehicleItem}>
              <Text style={styles.vehicleText}>Marca: {item.brand}</Text>
              <Text style={styles.vehicleText}>Placa: {item.licence}</Text>
              <Text style={styles.vehicleText}>Modelo: {item.model}</Text>
              <Text style={styles.vehicleText}>Año: {item.year}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noVehiclesText}>No tienes vehículos registrados.</Text>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  vehicleItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  vehicleText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  noVehiclesText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default VehiclesScreen;