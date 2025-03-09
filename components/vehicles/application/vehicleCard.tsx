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

      {/* Información del vehículo en dos filas de dos campos */}
      <View style={styles.row}>
        <View style={styles.vehicleInfo}>
          <MaterialIcons name="directions-car" size={24} color="#6C63FF" />
          <Text style={styles.vehicleText}>Marca: {vehicle.brand}</Text>
        </View>
        <View style={styles.vehicleInfo}>
          <MaterialIcons name="confirmation-number" size={24} color="#6C63FF" />
          <Text style={styles.vehicleText}>Placa: {vehicle.licence}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.vehicleInfo}>
          <MaterialIcons name="build" size={24} color="#6C63FF" />
          <Text style={styles.vehicleText}>Modelo: {vehicle.model}</Text>
        </View>
        <View style={styles.vehicleInfo}>
          <MaterialIcons name="calendar-today" size={24} color="#6C63FF" />
          <Text style={styles.vehicleText}>Año: {vehicle.year}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleItem: {
    padding: 16, // Padding interno
    marginBottom: 10,
    marginHorizontal: 15, // Margen horizontal
    backgroundColor: "rgba(46, 39, 57, 0.8)", // Color del contenedor del perfil
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)", // Borde sutil
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, 
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, 
    marginRight: 10, 
  },
  vehicleText: {
    fontSize: 16,
    color: "#FFF", 
    marginLeft: 8, 
    fontWeight: "500",
  },
  deleteButton: {
    position: "absolute",
    top: 60,
    right: 10,
    width: 40,
    height: 30,
    borderRadius: 30,
    overflow: "hidden",
  },
  editButton: {
    position: "absolute",
    top: -7,
    right: -5, 
    width: 30,
    height: 30,
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