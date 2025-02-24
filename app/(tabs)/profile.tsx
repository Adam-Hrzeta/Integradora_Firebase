import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../lib/Firebase";
import { updatePassword, updateEmail, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import EmailModal from "../../components/EmailModal";
import PasswordModal from "../../components/NewPasswordModal";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setProfileImage(user.photoURL || "https://via.placeholder.com/150");
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <Text>Inicie sesión para acceder a su perfil...</Text>;
  }

  const handleUpdateEmail = async (newEmail: string) => {
    if (!newEmail) {
      Alert.alert("Error", "El correo electrónico no puede estar vacío.");
      return;
    }

    try {
      setLoading(true);
      await updateEmail(user, newEmail);
      setEmail(newEmail);
      setEmailModalVisible(false);
      Alert.alert("Éxito", "Correo electrónico actualizado correctamente.");
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

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Perfil de Usuario</Text>

        {/* Imagen de perfil */}
        <Image source={{ uri: profileImage || "https://via.placeholder.com/150" }} style={styles.profileImage} />

        <Button title="Cambiar Imagen de Perfil" onPress={handleUpdateProfileImage} color="#7E57C2" />

        {/* Correo electrónico */}
        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.emailText}>{email}</Text>

        {/* Botones para editar correo y contraseña */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => setEmailModalVisible(true)}>
            <Text style={styles.buttonText}>Editar Correo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(true)}>
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#7E57C2" />}
      </View>

      {/* Modales */}
      <EmailModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        onUpdateEmail={handleUpdateEmail}
        currentEmail={email}
      />
      <PasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onUpdatePassword={handleUpdatePassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(46, 39, 57, 0.8)",
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#7E57C2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "48%", // Para que ambos botones quepan en una fila
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProfileScreen;