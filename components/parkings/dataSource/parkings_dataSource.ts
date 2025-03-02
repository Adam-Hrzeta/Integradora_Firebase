import { collection, getDocs, query } from "firebase/firestore";
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
}