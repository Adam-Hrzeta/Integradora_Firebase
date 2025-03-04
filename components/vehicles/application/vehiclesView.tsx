import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { VehiclesDataSource } from "../dataSource/vehicles_dataSource";
import { Vehicle } from "../entities/vehicle";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Para el degradado del botón
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
        <ActivityIndicator size="large" color="#6C63FF" />
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
    <ImageBackground
      source={{
        uri: "https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg",
      }}
      style={styles.background}
      blurRadius={10}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Tus vehículos registrados</Text>
        {vehicles.length > 0 ? (
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VehicleCard vehicle={item} onDelete={handleDeleteVehicle} />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.noVehiclesText}>No tienes vehículos registrados.</Text>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/registerVehicle")}
        >
          <LinearGradient
            colors={["#6C63FF", "#8E85FF"]} // Degradado morado
            style={styles.gradient}
          >
            <MaterialIcons name="add" size={30} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFF",
    textAlign: "center",
  },
  noVehiclesText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  listContent: {
    paddingBottom: 80, // Espacio para el botón flotante
  },
});

export default VehiclesScreen;