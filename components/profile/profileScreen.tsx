import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../lib/firebase";
import { updateEmail, updateProfile, updatePassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import EmailModal from "../EmailModal";
import PasswordModal from "./NewPasswordModal";
import NameModal from "./NewNameModal";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setProfileImage(user.photoURL || null);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <Text>Inicie sesión para acceder a su perfil...</Text>;
  }

  const handleUpdatePassword = async (newPassword: string) => {
    if (!newPassword) {
      Alert.alert("Error", "La nueva contraseña no puede estar vacía.");
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

  const handleUpdateName = async (newName: string) => {
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

  return (
    <ImageBackground
      source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/515/340/original/parking-top-view-garage-floor-with-cars-from-above-city-parking-lot-with-free-space-cartoon-street-carpark-with-various-vehicles-illustration-vector.jpg" }}
      style={styles.background}
      blurRadius={10}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>{user.displayName || "Sin nombre"}</Text>

            {/* Imagen de perfil */}
            <View style={styles.imageContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : require("../../assets/images/defaultProfile.png")}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editIcon} onPress={handleUpdateProfileImage}>
                <Ionicons name="camera" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Nombre del usuario */}
            <TouchableOpacity style={styles.editName} onPress={() => setNameModalVisible(true)}>
              <MaterialIcons name="drive-file-rename-outline" size={24} color="white" />
            </TouchableOpacity>

            {/* Correo electrónico */}
            <Text style={styles.label}>Correo electrónico:</Text>
            <Text style={styles.emailText}>{email}</Text>

            {/* Botones para editar correo y contraseña */}
            <View>
              <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(true)}>
                <Text style={styles.buttonText}>Cambiar Contraseña</Text>
              </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color="#7E57C2" />}
          </View>

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
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "80%",
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
  imageContainer: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7E57C2",
    borderRadius: 15,
    padding: 5,
  },
  editName: {
    position: "absolute",
    bottom: 345,
    right: 75,
    backgroundColor: "#7E57C2",
    borderRadius: 15,
    padding: 4,
  },
  label: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#B39DDB",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7E57C2",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;