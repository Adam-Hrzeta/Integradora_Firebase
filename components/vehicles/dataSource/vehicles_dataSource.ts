import { db } from "@/lib/firebase";
import { Vehicle } from "../entities/vehicle";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";

export class VehiclesDataSource {
  constructor() {}

  // Obtener vehículos del usuario
  async getUserVehicle(uid: string): Promise<Vehicle[]> {
    const items: Vehicle[] = [];

    // Traer los vehículos del usuario filtrados por userId
    const vehiclesRef = collection(db, "vehicles");
    const q = query(vehiclesRef, where("userId", "==", uid)); // Filtrar por userId

    const docSnap = await getDocs(q);

    // Para leer los datos se usa data() del snapshot
    docSnap.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());

      const docData = doc.data();

      const item: Vehicle = {
        id: doc.id,
        brand: docData.brand,
        licence: docData.licence,
        model: docData.model,
        year: docData.year,
      };

      items.push(item);
    });

    return items;
  }

  // Eliminar un vehículo por su ID
  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const vehicleRef = doc(db, "vehicles", vehicleId);
      await deleteDoc(vehicleRef);
      console.log("Vehículo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      throw error;
    }
  }
}