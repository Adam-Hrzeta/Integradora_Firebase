import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase";
import { updatePassword, updateEmail, updateProfile, User } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log("Usuario autenticado:", user.email); // Depuración
      setEmail(user.email || "");
      setProfileImage(user.photoURL || "https://via.placeholder.com/150"); // Imagen por defecto
    } else {
      console.log("No hay usuario autenticado."); // Depuración
    }
  }, [user]);

  const handleUpdateEmail = async () => {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    if (!email) {
      Alert.alert("Error", "El correo electrónico no puede estar vacío.");
      return;
    }

    try {
      setLoading(true);
      await updateEmail(user, email);
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

  const handleUpdatePassword = async () => {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    if (!newPassword) {
      Alert.alert("Error", "La nueva contraseña no puede estar vacía.");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      setNewPassword("");
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

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Perfil de Usuario</Text>

        {/* Imagen de perfil */}
        <Image
          source={{ uri: profileImage || "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />

        <Button
          title="Cambiar Imagen de Perfil"
          onPress={handleUpdateProfileImage}
          color="#7E57C2"
        />

        {/* Correo electrónico */}
        <Text style={styles.label}>Correo electrónico:</Text>
        {user ? (
          <Text style={styles.emailText}>{email}</Text>
        ) : (
          <Text style={styles.emailText}>No hay un usuario autenticado.</Text>
        )}

        {/* Nueva contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor="#B39DDB"
        />
        <Button
          title="Actualizar Contraseña"
          onPress={handleUpdatePassword}
          color="#7E57C2"
        />

        {loading && <ActivityIndicator size="large" color="#7E57C2" />}
      </View>
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
  input: {
    height: 40,
    borderBottomColor: "#7E57C2",
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    color: "#FFF",
  },
});

export default ProfileScreen;