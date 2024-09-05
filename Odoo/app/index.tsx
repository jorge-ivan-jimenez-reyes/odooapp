import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Odoo logo and message */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Odoo_logo.png' }} 
          style={styles.logo}
        />
        <Text style={styles.headerText}>You are browsing Odoo</Text>
      </View>

      {/* Loader when the page is loading */}
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

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.button} onPress={() => webViewRef.current?.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => webViewRef.current?.goForward()}>
          <Text style={styles.buttonText}>Forward</Text>
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
    backgroundColor: '#F2F2F2', // Light gray background
  },
  header: {
    backgroundColor: '#625488', // Morado que prefieres
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
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
    backgroundColor: '#625488', // Morado para el botón de retry
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#625488', // Morado para la sección de botones de navegación
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