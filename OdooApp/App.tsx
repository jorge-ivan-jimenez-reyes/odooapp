import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

// URL de tu WebSocket (de Odoo o cualquier otro servidor WebSocket)
const WEBSOCKET_URL = 'ws://192.168.1.136:8080';

const OdooWebView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);
  const [wsMessage, setWsMessage] = useState<string>(''); // Estado para guardar mensajes de WebSocket

  // Configuración del WebSocket
  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send('Cliente conectado a WebSocket desde React Native'); // Envía un mensaje al servidor
    };

    ws.onmessage = (event) => {
      const message = event.data;
      setWsMessage(message); // Actualiza el estado con el mensaje recibido
      console.log('Mensaje recibido del WebSocket:', message);
      // Opción: inyectar el mensaje en la WebView o mostrar una alerta
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          alert("Mensaje recibido en WebSocket: ${message}");
        `);
      }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con logo y título */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Odoo_logo.png' }} 
          style={styles.logo}
        />
        <Text style={styles.headerText}>CRM Odoo - Ciudad Segura</Text>
      </View>

      {/* Loader mientras carga el WebView */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#625488" />
        </View>
      )}

      {/* WebView para mostrar la interfaz del CRM de Odoo */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error cargando la página. Intenta nuevamente.</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setError(false);
              setLoading(true);
              webViewRef.current?.reload();
            }}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView 
          ref={webViewRef}
          source={{ uri: 'https://portal.wtech-cs.com/en/web/login?login=jjimenez%40wtech-cs.com&redirect=%2Fweb' }} // URL del CRM de Odoo
          style={{ flex: 1 }}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          javaScriptEnabled={true}
          // Inyecta JavaScript para recibir mensajes desde WebSocket y alertarlos en la WebView
          injectedJavaScript={`
            (function() {
              const socket = new WebSocket('${WEBSOCKET_URL}');
              socket.onmessage = function(event) {
                window.ReactNativeWebView.postMessage(event.data);
              };
            })();
          `}
          onMessage={(event) => {
            const message = event.nativeEvent.data;
            // Puedes procesar el mensaje en la app nativa, mostrarlo o hacer algo más
            Alert.alert("Notificación recibida", message);
            console.log('Mensaje desde WebView:', message);
          }}
        />
      )}

      {/* Botones de navegación para el WebView */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.button} onPress={() => webViewRef.current?.goBack()}>
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => webViewRef.current?.reload()}>
          <Text style={styles.buttonText}>Recargar</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar mensajes de WebSocket recibidos */}
      {wsMessage ? (
        <View style={styles.wsMessageContainer}>
          <Text style={styles.wsMessageText}>Mensaje en tiempo real: {wsMessage}</Text>
        </View>
      ) : null}
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
    backgroundColor: '#71629e', // Morado para el botón de reintentar
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

export default OdooWebView;