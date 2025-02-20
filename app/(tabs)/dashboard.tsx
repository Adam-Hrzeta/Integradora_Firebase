import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Para íconos
import QRCode from 'react-native-qrcode-svg'; // Para generar QR

const ParkingSpotPicker: React.FC = () => {
  const [spots, setSpots] = useState([
    { id: 'A01', isOccupied: false },
    { id: 'A02', isOccupied: false },
    { id: 'A03', isOccupied: false },
    { id: 'A04', isOccupied: false },
    { id: 'A05', isOccupied: false },
  ]);
  const [showQR, setShowQR] = useState<boolean>(false); // Estado para mostrar el QR
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animación de opacidad para el QR

  // Simulación de datos de IoT (esto se reemplazará con datos reales de los sensores)
  useEffect(() => {
    const interval = setInterval(() => {
      // Aquí se actualizarán los datos de los sensores en tiempo real
      // Por ahora, simulamos cambios aleatorios
      setSpots((prevSpots) =>
        prevSpots.map((spot) => ({
          ...spot,
          isOccupied: Math.random() > 0.5, // Simula ocupación aleatoria
        }))
      );
    }, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Función para manejar el botón "Quiero estacionarme"
  const handleParkingRequest = () => {
    const availableSpots = spots.filter((spot) => !spot.isOccupied);

    if (availableSpots.length === 0) {
      // Si no hay lugares disponibles, mostrar advertencia
      Alert.alert(
        'Advertencia',
        'En este momento no hay lugares disponibles. Por favor, intente más tarde.',
        [{ text: 'OK' }]
      );
    } else {
      // Si hay lugares disponibles, seleccionar uno aleatorio y mostrar el QR
      const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
      setSelectedSpot(randomSpot.id);
      setShowQR(true); // Mostrar el QR

      // Iniciar animación de opacidad
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Duración de la animación en milisegundos
        useNativeDriver: true, // Mejora el rendimiento
      }).start();

      // Enviar señal para levantar la pluma (simulación)
      Alert.alert('Pluma levantada', `Lugar ${randomSpot.id} asignado. Pluma levantada.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Lugares de estacionamiento */}
      <View style={styles.parkingLot}>
        <View style={styles.spotsContainer}>
          {spots.map((spot) => (
            <View
              key={spot.id}
              style={[
                styles.spot,
                selectedSpot === spot.id && styles.selectedSpot,
              ]}
            >
              {/* Líneas horizontales del cajón de estacionamiento */}
              <View style={styles.topLine}></View>
              <View style={styles.bottomLine}></View>

              {/* Representación del auto (imagen) */}
              {spot.isOccupied && (
                <View style={styles.car}>
                  <Image
                    source={require('../../assets/images/auto.png')} // Ruta de la imagen
                    style={styles.carImage}
                    resizeMode="contain" // Ajusta la imagen al contenedor
                  />
                </View>
              )}

              {/* Indicador de disponibilidad */}
              {!spot.isOccupied && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}

              {/* Número del lugar */}
              <Text style={styles.spotId}>{spot.id}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Botón "Quiero estacionarme" */}
      <TouchableOpacity style={styles.continueButton} onPress={handleParkingRequest}>
        <Text style={styles.continueButtonText}>Quiero estacionarme</Text>
      </TouchableOpacity>

      {/* Mostrar QR si hay un lugar disponible */}
      {showQR && selectedSpot && (
        <Animated.View style={[styles.qrContainer, { opacity: fadeAnim }]}>
          <Text style={styles.qrText}>Lugar asignado: {selectedSpot}</Text>
          <QRCode
            value={selectedSpot} // El valor del QR es el ID del lugar seleccionado
            size={200} // Tamaño del QR
            color="#000" // Color del QR
            backgroundColor="#fff" // Fondo del QR
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },
  parkingLot: {
    flex: 1,
  },
  entryLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  spotsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%',
  },
  spot: {
    width: '100%',
    height: 100,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedSpot: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#666',
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#666',
  },
  car: {
    position: 'absolute',
    top: '21%',
    left: '10%',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  spotId: {
    fontSize: 14,
    color: 'white',
    marginTop: 8,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});

export default ParkingSpotPicker;