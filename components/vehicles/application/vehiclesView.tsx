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
import { LinearGradient } from "expo-linear-gradient";
import VehicleCard from "../../../components/vehicles/application/vehicleCard";
import EditVehicleModal from "../../../components/vehicles/application/EditVehicleModal";

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Usuario autenticado, UID:", user.uid);
        const dataSource = new VehiclesDataSource();
        const unsubscribeSnapshot = await dataSource.getUserVehicle(user.uid, (vehiclesData) => {
          setVehicles(vehiclesData);
          setError(null);
          setLoading(false);
        });

        return () => unsubscribeSnapshot(); // Limpiar la suscripción al desmontar el componente
      } else {
        console.error("❌ No user logged in");
        setError("No hay un usuario autenticado.");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const dataSource = new VehiclesDataSource();
      await dataSource.deleteVehicle(vehicleId);
      Alert.alert("Vehículo eliminado", "El vehículo ha sido eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      Alert.alert("Error", "Hubo un problema al eliminar el vehículo. Inténtalo de nuevo.");
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalVisible(true);
  };

  const handleSaveVehicle = async (vehicle: Vehicle) => {
    try {
      const dataSource = new VehiclesDataSource();
      await dataSource.updateVehicle(vehicle);
      Alert.alert("Vehículo actualizado", "El vehículo ha sido actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el vehículo. Inténtalo de nuevo.");
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
              <VehicleCard
                vehicle={item}
                onDelete={handleDeleteVehicle}
                onEdit={handleEditVehicle}
              />
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
            colors={["#6C63FF", "#8E85FF"]}
            style={styles.gradient}
          >
            <MaterialIcons name="add" size={30} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
        {editingVehicle && (
          <EditVehicleModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            vehicle={editingVehicle}
            onSave={handleSaveVehicle}
          />
        )}
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
    paddingBottom: 80,
  },
});

export default VehiclesScreen;