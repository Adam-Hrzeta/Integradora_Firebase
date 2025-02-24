import { db } from "@/lib/Firebase";
import { Vehicle } from "../entities/vehicle";
import { doc, getDoc } from "firebase/firestore";

export class VehiclesDataSource{
    constructor(){
    }

    async getUserVehicles(userId: string) : Promise<Vehicle[]>{
        //traer los vehiculos del usuario
        const docRef = doc(db, "vehicles");
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        const items: Vehicle[] = [];

        return items;
    }
}