import { collection, getDocs, query, where } from "firebase/firestore";
import { Parking } from "../entities/parking";
import { db } from "@/lib/firebase";

export class ParkingDataSource{
    constructor(){}

    async getParking() : Promise<Parking[]>{
        //en items se almacenara los documentos traidos de firabase
        const items: Parking[] = [];

        //traer los parking 
        const docSnap = await getDocs(query(collection(db, "parkings")));

        //para leer los datos
        docSnap.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());

            //transformar cada documento a una instancia del tipo parking
            const docData = doc.data();

            const item : Parking = {
                id: doc.id,
                label: docData.label,
                status: docData.status,
            }

            items.push(item);
        });

        return items;

    }

     // Método para obtener solo los estacionamientos con status "libre"
     async getFreeParking(): Promise<Parking[]> {
        const items: Parking[] = [];

        // Consulta para filtrar por status "libre"
        const q = query(collection(db, "parkings"), where("status", "==", "libre"));

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            const docData = doc.data();

            const item: Parking = {
                id: doc.id,
                label: docData.label,
                status: docData.status,
            };

            items.push(item);
        });

        return items;
    }
}