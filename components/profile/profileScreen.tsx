import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../lib/firebase";
import { updateProfile, updatePassword, User } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import PasswordModal from "./NewPasswordModal";
import NameModal from "./NewNameModal";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { VehiclesDataSource } from "../../components/vehicles/dataSource/vehicles_dataSource";
import { Vehicle } from "../vehicles/entities/vehicle";
import VehicleCard from "../../components/vehicles/application/vehicleCard";
import EditVehicleModal from "../../components/vehicles/application/EditVehicleModal";
import { LinearGradient } from "expo-linear-gradient";
import RegisterVehicleModal from "../../components/vehicles/application/registerVehicleModal";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setProfileImage(user.photoURL || null);

        const dataSource = new VehiclesDataSource();
        const unsubscribeSnapshot = await dataSource.getUserVehicle(user.uid, (vehiclesData) => {
          setVehicles(vehiclesData);
        });

        return () => unsubscribeSnapshot();
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdatePassword = async (newPassword: string) => {
    if (!newPassword) {
      Alert.alert("Error", "La nueva contraseña no puede estar vacía.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      setNewPassword("");
      setPasswordModalVisible(false);
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la galería para cambiar la imagen.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setLoading(true);
        await updateProfile(user, { photoURL: result.assets[0].uri });
        setProfileImage(result.assets[0].uri);
        Alert.alert("Éxito", "Imagen de perfil actualizada correctamente.");
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "Ocurrió un error inesperado.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Ocurrió un error al cerrar la sesión.");
      }
    }
  };

  const handleUpdateName = async (newName: string) => {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(user, { displayName: newName });
      Alert.alert("Éxito", "Nombre actualizado correctamente.");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const dataSource = new VehiclesDataSource();
      await dataSource.deleteVehicle(vehicleId);
      Alert.alert("Vehículo eliminado", "El vehículo ha sido eliminado correctamente.");
      if (user) {
        dataSource.getUserVehicle(user.uid, (vehiclesData) => {
          setVehicles(vehiclesData);
        });
      }
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
      if (user) {
        dataSource.getUserVehicle(user.uid, (vehiclesData) => {
          setVehicles(vehiclesData);
        });
      }
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el vehículo. Inténtalo de nuevo.");
    }
  };

  const handleVehicleAdded = () => {
    if (user) {
      const dataSource = new VehiclesDataSource();
      dataSource.getUserVehicle(user.uid, (vehiclesData) => {
        setVehicles(vehiclesData);
      });
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Inicie sesión para acceder a su perfil...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg" }}
      style={styles.background}
      blurRadius={10}
    >
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* Profile Section */}
            <View style={styles.horizontalContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={profileImage ? { uri: profileImage } : require("../../assets/images/defaultProfile.png")}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editIcon} onPress={handleUpdateProfileImage}>
                  <Ionicons name="camera" size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                  <Ionicons name="log-out" size={20} color="#FFF" />
                  <Text style={styles.signOutText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                  <Text style={styles.title}>{user.displayName || "Sin nombre"}</Text>
                  <TouchableOpacity style={styles.editName} onPress={() => setNameModalVisible(true)}>
                    <MaterialIcons name="drive-file-rename-outline" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Correo electrónico:</Text>
                <Text style={styles.emailText}>{email}</Text>

                {/* Botón de Cambiar Contraseña */}
                <TouchableOpacity style={styles.changePasswordButton} onPress={() => setPasswordModalVisible(true)}>
                  <Ionicons name="key" size={16} color="#FFF" />
                  <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Título y Botón de Agregar Vehículo */}
            <View style={styles.vehiclesHeader}>
              <Text style={styles.vehiclesTitle}>Mis vehículos registrados</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onDelete={handleDeleteVehicle}
            onEdit={handleEditVehicle}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noVehiclesText}>No tienes vehículos registrados.</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {loading && <ActivityIndicator size="large" color="#7E57C2" />}

      {/* Modals */}
      <PasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onUpdatePassword={handleUpdatePassword}
      />
      <NameModal
        visible={nameModalVisible}
        onClose={() => setNameModalVisible(false)}
        onUpdateName={handleUpdateName}
        currentName={user.displayName || ""}
      />
      {editingVehicle && (
        <EditVehicleModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
        />
      )}

      {/* Modal de Registro de Vehículo */}
      <RegisterVehicleModal
        visible={registerModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        onVehicleAdded={handleVehicleAdded}
      />
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(46, 39, 57, 0.8)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageContainer: {
    marginRight: 20,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7E57C2",
    borderRadius: 15,
    padding: 5,
  },
  signOutButton: {
    position: "absolute",
    bottom: -40,
    left: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    color: "#FFF",
    fontSize: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 10,
  },
  editName: {
    backgroundColor: "#7E57C2",
    borderRadius: 15,
    padding: 4,
    right: 50,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 2,
  },
  emailText: {
    fontSize: 14,
    color: "#B39DDB",
    marginBottom: 5,
  },
  changePasswordButton: {
    backgroundColor: "#7E57C2",
    borderRadius: 8,
    paddingVertical: 5,
    marginRight: 25,
    marginLeft:25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  changePasswordText: {
    color: "#FFF",
    fontSize: 12,
  },
  vehiclesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  vehiclesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  addButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 25,
    padding: 10,
  },
  noVehiclesText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;