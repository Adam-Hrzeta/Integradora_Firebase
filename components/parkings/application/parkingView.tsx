import { useEffect, useState } from "react";
import { Parking } from "../entities/parking";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ParkingDataSource } from "../dataSource/parkings_dataSource";
import { ActivityIndicator, FlatList, View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

const ParkingScreen = () => {
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showQRModal, setShowQRModal] = useState(false); // Para controlar la visibilidad del modal del QR
    const [selectedParking, setSelectedParking] = useState<Parking | null>(null); // Cajón seleccionado para el QR
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Para deshabilitar el botón

    useEffect(() => {
        const auth = getAuth();

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const dataSource = new ParkingDataSource();
                    const parkingsData = await dataSource.getFreeParking(); // Solo mostramos los estacionamientos libres
                    setParkings(parkingsData);

                    // Escuchar cambios en tiempo real para los estacionamientos
                    const unsubscribeSnapshot = onSnapshot(collection(db, "parkings"), (snapshot) => {
                        const updatedParkings = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })) as Parking[];
                        setParkings(updatedParkings);

                        // Verificar si hay algún estacionamiento en estado "reservado"
                        const isReserved = updatedParkings.some((parking) => parking.status === "reservado");
                        setIsButtonDisabled(isReserved); // Deshabilitar el botón si hay un estacionamiento reservado
                    });

                    return () => unsubscribeSnapshot(); // Limpiar la suscripción al desmontar
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

        return () => unsubscribeAuth(); // Limpiar la suscripción al desmontar
    }, []);

    // Función para manejar el clic en "Quiero estacionarme"
    const handleParkingClick = async () => {
        if (parkings.length > 0) {
            const firstFreeParking = parkings[0]; // Seleccionar el primer cajón libre
            setSelectedParking(firstFreeParking);
            setShowQRModal(true);

            // Marcar el estacionamiento como "reservado"
            const parkingRef = doc(db, "parkings", firstFreeParking.id);
            await updateDoc(parkingRef, { status: "reservado" });
        }
    };

    // Función para cerrar el modal del QR
    const closeQRModal = () => {
        setShowQRModal(false);
        setSelectedParking(null);
    };

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
                return <AntDesign name="closecircle" size={24} color="red" />;
            case "reservado":
                return <Entypo name="clock" size={24} color="orange" />; // Ícono de reloj para "reservado"
            case "servicio":
                return <Entypo name="tools" size={24} color="orange" />;
            default:
                return <FontAwesome5 name="check-circle" size={24} color="green" />;
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
                        {item.status === "reservado" && ( // Mostrar leyenda si el cajón está reservado
                            <Text style={styles.waitingText}>Espere mientras el usuario anterior se estaciona...</Text>
                        )}
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />

            {/* Botón para generar el QR */}
            <TouchableOpacity
                style={[styles.parkingButton, isButtonDisabled && styles.disabledButton]} // Estilo condicional para el botón
                onPress={handleParkingClick}
                disabled={isButtonDisabled} // Deshabilitar el botón si isButtonDisabled es true
            >
                <Text style={styles.buttonText}>Quiero estacionarme</Text>
            </TouchableOpacity>

            {/* Modal para mostrar el QR */}
            <Modal visible={showQRModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>QR para estacionarse</Text>
                        {selectedParking && (
                            <QRCode
                                value={`parking:${selectedParking.id}`} // Generar QR con el ID del cajón
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={closeQRModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        height: 120, // Alto de cada cajón (aumentado para incluir la leyenda)
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
    waitingText: {
        marginTop: 5,
        fontSize: 12,
        color: "#ff5722", // Color naranja para la leyenda
        textAlign: "center",
    },
    parkingButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc", // Color gris para el botón deshabilitado
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default ParkingScreen;