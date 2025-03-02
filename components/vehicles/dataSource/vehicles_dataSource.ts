import { db } from "@/lib/firebase";
import { Vehicle } from "../entities/vehicle";
import { collection, getDocs, query } from "firebase/firestore";

export class VehiclesDataSource{
    constructor(){}

    async getUserVehicle() : Promise<Vehicle[]>{
        //en items vamos a almacenar los documentos traidos de firabase
        const items: Vehicle[] = [];

        //traer los vehiculos del usuario
        const docSnap = await getDocs(query(collection(db, "vehicles")));
        //para leer los datos se usa data() del snapshot
        docSnap.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());

            //transformar cada documento a un objeto Vehicle
            // ---> Mapping
            const docData = doc.data();

            const item : Vehicle = {
                id: doc.id,
                brand: docData.brand,
                licence: docData.licence,
                model: docData.model,
                year: docData.year,
            }

            items.push(item);
        });

        return items;
    }
}
