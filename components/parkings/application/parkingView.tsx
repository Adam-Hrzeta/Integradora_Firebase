import { useEffect, useState } from "react";
import { Parking } from "../entities/parking";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ParkingDataSource } from "../dataSource/parkings_dataSource";
import { ActivityIndicator, FlatList, View, StyleSheet, Text } from "react-native";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";

const ParkingScreen = () => {
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const dataSource = new ParkingDataSource();
                    const parkingsData = await dataSource.getParking();
                    setParkings(parkingsData);
                } catch (error) {
                    console.error("Error fetching parkings:", error);
                    setError("Error al cargar los estacionamientos");
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

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Función para obtener el ícono según el estado
    const getIconByStatus = (status: string) => {
        switch (status) {
            case "ocupado":
                return <AntDesign name="closecircle" size={24} color="black" />;
            case "servicio":
                return <Entypo name="tools" size={24} color="black" />;
            default:
                return <FontAwesome5 name="check-circle" size={24} color="black" />;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Estacionamientos</Text>
            <FlatList
                data={parkings}
                keyExtractor={(item) => item.id}
                numColumns={3} // Mostrar en cuadrícula de 3 columnas
                renderItem={({ item }) => (
                    <View style={styles.parkingItem}>
                        {getIconByStatus(item.status)}
                        <Text style={styles.parkingText}>Cajón {item.label}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    listContainer: {
        justifyContent: "center",
    },
    parkingItem: {
        width: 100, // Ancho de cada cajón
        height: 100, // Alto de cada cajón
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    parkingText: {
        marginTop: 5,
        fontSize: 14,
        color: "#333",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
});

export default ParkingScreen;