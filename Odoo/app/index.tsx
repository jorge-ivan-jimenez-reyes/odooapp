import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Cambia esta URL por la de tu servidor WebSocket
const WEBSOCKET_URL = 'ws://192.168.1.136:8080';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);
  const [wsMessage, setWsMessage] = useState<string>(''); // Estado para mensajes WebSocket

  useEffect(() => {
    // Configuración de WebSocket
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send('Hola desde el cliente React Native'); // Envía un mensaje al servidor
    };

    ws.onmessage = (event) => {
      const message = event.data;
      setWsMessage(message); // Actualizar estado con mensaje recibido
      console.log('Message from WebSocket:', message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Cierra el WebSocket cuando el componente se desmonta
    };
  }, []);

  useEffect(() => {
    // Configurar Firebase Cloud Messaging para recibir notificaciones push
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
        },
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Solicitar permisos de notificaciones push
    messaging().requestPermission().then(authStatus => {
      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        console.log('Notification permission granted.');
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con logo y título */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Odoo_logo.png' }} 
          style={styles.logo}
        />
        <Text style={styles.headerText}>WTECH Ciudad Segura</Text>
      </View>

      {/* Loader durante la carga */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#625488" />
        </View>
      )}

      {/* Error Handling */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading page. Please try again.</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setError(false);
              setLoading(true);
              webViewRef.current?.reload();
            }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView 
          ref={webViewRef}
          source={{ uri: 'https://portal.wtech-cs.com/en/web/login?login=jjimenez%40wtech-cs.com&redirect=%2Fweb' }}
          style={{ flex: 1 }}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
      )}

      {/* Mostrar mensajes de WebSocket */}
      {wsMessage ? (
        <View style={styles.wsMessageContainer}>
          <Text style={styles.wsMessageText}>Mensaje en tiempo real: {wsMessage}</Text>
        </View>
      ) : null}

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.button} onPress={() => webViewRef.current?.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => webViewRef.current?.reload()}>
          <Text style={styles.buttonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Fondo gris claro
  },
  header: {
    backgroundColor: '#71629e', // Morado oscuro
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
  },
  retryButton: {
    backgroundColor: '#71629e', // Morado para el botón de retry
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wsMessageContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    margin: 10,
    borderRadius: 5,
  },
  wsMessageText: {
    fontSize: 16,
    color: '#333',
  },
  
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#625488',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#625488', // Morado para el texto de los botones
    fontWeight: 'bold',
  },
});

export default App;