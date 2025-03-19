import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  fromAdmin: boolean;
  userId: string;
  userEmail: string;
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Crear query para obtener mensajes del usuario actual
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('userId', '==', user.uid));

    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Message[];

      // Ordenar mensajes por fecha (más recientes primero)
      messageList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        read: true
      });
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false,
        fromAdmin: false,
        userId: user.uid,
        userEmail: user.email
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={[
        styles.messageCard,
        !item.read && styles.unreadMessage
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.messageHeader}>
        <MaterialIcons 
          name={item.fromAdmin ? "admin-panel-settings" : "message"} 
          size={24} 
          color="#7e57c2" 
        />
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.messageText}>{item.message}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando mensajes...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="message" size={48} color="#7e57c2" />
            <Text style={styles.emptyText}>No hay mensajes</Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={newMessage.trim() ? "#7e57c2" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Espacio para el input
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadMessage: {
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#7e57c2',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    marginLeft: 8,
    color: '#666',
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
}); 