// datasource.ts
import { auth } from "../../lib/FireBase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

// Iniciar sesión
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error("Error al iniciar sesión: " + error.message);
  }
};

// Registrar usuario
export const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error: any) {
    throw new Error("Error al registrar usuario: " + error.message);
  }
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error("Error al cerrar sesión: " + error.message);
  }
};

// Actualizar perfil
export const updateUserProfile = async (
  displayName: string,
  photoURL: string
): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    } else {
      throw new Error("No hay un usuario autenticado.");
    }
  } catch (error: any) {
    throw new Error("Error al actualizar el perfil: " + error.message);
  }
};