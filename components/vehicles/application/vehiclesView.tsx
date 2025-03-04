import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { VehiclesDataSource } from "../dataSource/vehicles_dataSource";
import { Vehicle } from "../entities/vehicle";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const VehiclesScreen = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const dataSource = new VehiclesDataSource();
                    const vehiclesData = await dataSource.getUserVehicle(user.uid);  // Pasamos el uid del usuario aquí
                    setVehicles(vehiclesData);
                } catch (error) {
                    console.error("Error fetching vehicles:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error("❌ No user logged in");
                setLoading(false);
            }
        });

        return () => unsubscribe(); 
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Lista de Vehículos</Text>
            <FlatList
                data={vehicles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                        <Text>Brand: {item.brand}</Text>
                        <Text>Licence: {item.licence}</Text>
                        <Text>Model: {item.model}</Text>
                        <Text>Year: {item.year}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default VehiclesScreen;
