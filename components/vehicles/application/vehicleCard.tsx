import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Para el degradado del botón
import { Vehicle } from "../entities/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete: (vehicleId: string) => void;
  onEdit: (vehicle: Vehicle) => void; // Nueva prop para editar
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onDelete, onEdit }) => {
  return (
    <View style={styles.vehicleItem}>
      {/* Botón de eliminar con degradado */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(vehicle.id)}
      >
        <LinearGradient
          colors={["#FF416C", "#FF4B2B"]}
          style={styles.gradient}
        >
          <MaterialIcons name="delete" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Botón de editar con degradado */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => onEdit(vehicle)} // Llama a la función onEdit con el vehículo
      >
        <LinearGradient
          colors={["#6C63FF", "#8E85FF"]} // Degradado morado
          style={styles.gradient}
        >
          <MaterialIcons name="edit" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Información del vehículo */}
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="directions-car" size={28} color="#6C63FF" />
        <Text style={styles.vehicleText}>Marca: {vehicle.brand}</Text>
      </View>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="confirmation-number" size={28} color="#6C63FF" />
        <Text style={styles.vehicleText}>Placa: {vehicle.licence}</Text>
      </View>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="build" size={28} color="#6C63FF" />
        <Text style={styles.vehicleText}>Modelo: {vehicle.model}</Text>
      </View>
      <View style={styles.vehicleInfo}>
        <MaterialIcons name="calendar-today" size={28} color="#6C63FF" />
        <Text style={styles.vehicleText}>Año: {vehicle.year}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleItem: {
    padding: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  vehicleText: {
    fontSize: 18,
    color: "#444",
    marginLeft: 15,
    fontWeight: "600",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 60, // Ajusta la posición para que no se superponga con el botón de eliminar
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VehicleCard;
