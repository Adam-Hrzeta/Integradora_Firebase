import { db } from "@/lib/firebase";
import { Vehicle } from "../entities/vehicle";
import { collection, getDocs, query, where } from "firebase/firestore";

export class VehiclesDataSource {
    constructor() {}

    async getUserVehicle(uid: string, vehicle: Vehicle): Promise<Vehicle[]> {
        // En items vamos a almacenar los documentos traídos de Firebase
        const items: Vehicle[] = [];

        // Traer los vehículos del usuario filtrados por userId (suponiendo que el campo en Firebase es 'userId')
        const vehiclesRef = collection(db, "vehicles");
        const q = query(vehiclesRef, where("userId", "==", uid));  // Filtrar por userId

        const docSnap = await getDocs(q);

        // Para leer los datos se usa data() del snapshot
        docSnap.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());

            // Transformar cada documento a un objeto Vehicle
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
}
