import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Vehicle } from "../entities/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onDelete }) => {
  return (
    <View style={styles.vehicleItem}>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="directions-car" size={20} color="#7E57C2" />
        <Text style={styles.vehicleText}>Marca: {vehicle.brand}</Text>
      </View>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="confirmation-number" size={20} color="#7E57C2" />
        <Text style={styles.vehicleText}>Placa: {vehicle.licence}</Text>
      </View>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="build" size={20} color="#7E57C2" />
        <Text style={styles.vehicleText}>Modelo: {vehicle.model}</Text>
      </View>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="calendar-today" size={20} color="#7E57C2" />
        <Text style={styles.vehicleText}>Año: {vehicle.year}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(vehicle.id)}
      >
        <MaterialIcons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  vehicleText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3C89",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default VehicleCard;