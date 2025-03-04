import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { VehiclesDataSource } from "../dataSource/vehicles_dataSource";
import { Vehicle } from "../entities/vehicle";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import VehicleCard from "../../../components/vehicles/application/vehicleCard";

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadVehicles = async (uid: string) => {
    try {
      const dataSource = new VehiclesDataSource();
      const vehiclesData = await dataSource.getUserVehicle(uid);
      setVehicles(vehiclesData);
      setError(null);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Error al cargar los vehículos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Usuario autenticado, UID:", user.uid);
        await loadVehicles(user.uid);
      } else {
        console.error("❌ No user logged in");
        setError("No hay un usuario autenticado.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const dataSource = new VehiclesDataSource();
      await dataSource.deleteVehicle(vehicleId);
      Alert.alert("Vehículo eliminado", "El vehículo ha sido eliminado correctamente.");
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await loadVehicles(user.uid);
      }
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      Alert.alert("Error", "Hubo un problema al eliminar el vehículo. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus vehículos registrados</Text>
      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VehicleCard vehicle={item} onDelete={handleDeleteVehicle} />
          )}
        />
      ) : (
        <Text style={styles.noVehiclesText}>No tienes vehículos registrados.</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/registerVehicle")}
      >
        <MaterialIcons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
  addButton: {
    backgroundColor: "#7E57C2",
    borderRadius: 20,
    marginLeft: 320,
  },
});

export default VehiclesScreen;