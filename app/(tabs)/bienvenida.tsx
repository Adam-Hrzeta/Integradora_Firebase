import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Para íconos

const ParkingSpotPicker: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  // Datos de ejemplo para los lugares de estacionamiento
  const spots = [
    { id: 'A01', isAvailable: true },
    { id: 'A02', isAvailable: false },
    { id: 'A03', isAvailable: true },
    { id: 'A04', isAvailable: false },
    { id: 'A05', isAvailable: true },
  ];

  return (
    <View style={styles.container}>
      {/* Lugares de estacionamiento */}
      <View style={styles.parkingLot}>
        <View style={styles.spotsContainer}>
          {spots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.spot,
                selectedSpot === spot.id && styles.selectedSpot,
              ]}
              onPress={() => setSelectedSpot(spot.id)}
            >
              {/* Líneas laterales del cajón de estacionamiento */}
              <View style={styles.leftLine}></View>
              <View style={styles.rightLine}></View>

              {/* Representación del auto (imagen) */}
              {!spot.isAvailable && (
                <View style={styles.car}>
                  <Image
                    source={require('../../assets/images/auto.png')} // Ruta de la imagen
                    style={styles.carImage}
                    resizeMode="contain" // Ajusta la imagen al contenedor
                  />
                </View>
              )}

              {/* Indicador de disponibilidad */}
              {spot.isAvailable && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}

              {/* Número del lugar */}
              <Text style={styles.spotId}>{spot.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón de continuar */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { opacity: selectedSpot ? 1 : 0.5 },
        ]}
        disabled={!selectedSpot}
        onPress={() => console.log('Continue')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
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
  leftLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 2,
    backgroundColor: '#666',
  },
  rightLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 2,
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
  },
  continueButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ParkingSpotPicker;