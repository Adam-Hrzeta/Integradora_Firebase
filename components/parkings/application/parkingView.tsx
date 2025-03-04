import { useEffect, useState } from "react";
import { Parking } from "../entities/parking";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ParkingDataSource } from "../dataSource/parkings_dataSource";
import { ActivityIndicator, FlatList, View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

const ParkingScreen = () => {
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isParkingInProgress, setIsParkingInProgress] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const dataSource = new ParkingDataSource();

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const parkingsData = await dataSource.getFreeParking();
                    setParkings(parkingsData);

                    const unsubscribeSnapshot = dataSource.subscribeToParkingChanges((updatedParkings) => {
                        setParkings(updatedParkings);

                        const isOccupied = updatedParkings.some((parking) => parking.status === "ocupado");
                        if (isOccupied) {
                            setIsParkingInProgress(false);
                            setIsButtonDisabled(false);
                        }
                    });

                    return () => unsubscribeSnapshot();
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

        return () => unsubscribeAuth();
    }, []);

    const handleParkingClick = async () => {
        setShowQRModal(true);
        setIsParkingInProgress(true);
        setIsButtonDisabled(true);
    };

    const closeQRModal = () => {
        setShowQRModal(false);
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

    const getIconByStatus = (status: string) => {
        switch (status) {
            case "ocupado":
                return <AntDesign name="closecircle" size={24} color="red" />;
            case "servicio":
                return (
                    <View>
                        <Entypo style={styles.iconService} name="tools" size={24} color="orange"/>
                        <Text style={styles.serviceText}>En servicio</Text>
                    </View>
                );
            default:
                return <Text style={styles.freeText}>Disponible</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Estacionamientos</Text>
            <FlatList
                data={parkings.filter((parking) => parking.status !== "ocupado")}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                    <View style={styles.parkingItem}>
                        {getIconByStatus(item.status)}
                        <Text style={styles.parkingText}>{item.label}</Text>
                        {isParkingInProgress && (
                            <Text style={styles.waitingText}>Espere hasta que el automóvil anterior se estacione...</Text>
                        )}
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity
                style={[styles.parkingButton, isButtonDisabled && styles.disabledButton]}
                onPress={handleParkingClick}
                disabled={isButtonDisabled}
            >
                <Text style={styles.buttonText}>Quiero estacionarme</Text>
            </TouchableOpacity>

            <Modal visible={showQRModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>QR para estacionarse</Text>
                        <QRCode
                            value="parking:reservado"
                            size={200}
                            color="black"
                            backgroundColor="white"
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={closeQRModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    iconService:{ 
        flexDirection: "row",
        alignItems: "center",
        left: 23,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    serviceText:{
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
        color: "orange",
    },
    freeText: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
        color: "green",
    },
    listContainer: {
        justifyContent: "center",
    },
    parkingItem: {
        width: 100,
        height: 120,
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
        color: "#ff5722",
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
        backgroundColor: "#ccc",
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