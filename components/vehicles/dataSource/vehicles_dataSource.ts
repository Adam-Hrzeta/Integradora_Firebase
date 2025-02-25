import { db } from "@/lib/Firebase";
import { Vehicle } from "../entities/vehicle";
import { collection, getDocs, query } from "firebase/firestore";

export class VehiclesDataSource{
    constructor(){
    }

    async getUserVehicle(userId: string) : Promise<Vehicle[]>{
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
                licence: docData.license,
                model: docData.model,
                owner_id: docData.owner_id,
                last_login: docData.last_login,
            }

            items.push(item);
        });

        return items;
    }
}