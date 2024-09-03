# Odoo Mobile App

Este proyecto es una aplicación móvil desarrollada con [Expo](https://expo.dev) y [React Native](https://reactnative.dev), diseñada para cargar la interfaz de Odoo directamente dentro de una aplicación móvil usando una WebView.

## Descripción

La aplicación se conecta a la instancia de Odoo a través de una WebView, proporcionando acceso a las funcionalidades de Odoo dentro de una aplicación nativa. Esto permite a los usuarios interactuar con Odoo como lo harían en un navegador, pero dentro de un entorno móvil más integrado.


## Captura de Pantalla

Aquí tienes un ejemplo de cómo se ve la aplicación en acción:

![Captura de Pantalla](./assets/images/ss1.png)

## Requisitos previos

- Node.js y npm instalados en tu sistema.
- Expo CLI instalado globalmente (`npm install -g expo-cli`).
- Un dispositivo físico o emulador configurado para probar la aplicación.

## Configuración del Proyecto

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tuusuario/odoo-mobile-app.git
   ```

## Estructura de el Proyecto

my-odoo-webview-app/
│
├── app/ # Carpeta principal para el código fuente
│ ├── index.tsx # Archivo principal que inicia la aplicación
│
├── node_modules/ # Dependencias instaladas por npm
├── .gitignore # Archivos y carpetas que git debe ignorar
├── app.json # Configuración de la aplicación Expo
├── babel.config.js # Configuración de Babel para la transpilación del código
├── package-lock.json # Detalles de las dependencias instaladas
├── package.json # Dependencias y scripts del proyecto
└── README.md # Documentación del proyecto
