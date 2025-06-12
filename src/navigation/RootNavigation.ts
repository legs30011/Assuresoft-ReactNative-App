// src/navigation/RootNavigation.ts

// Importa createNavigationContainerRef de React Navigation para crear la referencia
import { createNavigationContainerRef } from '@react-navigation/native';
// Importa tus tipos de parámetros de ruta definidos en navigation.d.ts
import { RootStackParamList } from '../types/navigation'; 

// Crea una referencia de contenedor para el NavigationContainer principal de tu aplicación.
// Esta referencia permite interactuar con el navegador desde cualquier lugar.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navega a una pantalla específica dentro del Stack Navigator.
 * @param name El nombre de la ruta (pantalla) a la que se quiere navegar.
 * Debe ser una clave definida en RootStackParamList.
 * @param params (Opcional) Los parámetros a pasar a la pantalla.
 */
export function navigate(name: keyof RootStackParamList, params?: any) {
  // Solo intenta navegar si el contenedor de navegación está listo
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    // Si no está listo, advierte en la consola (útil durante el arranque de la app)
    console.warn("NavigationContainer no está listo para navegar.");
  }
}

/**
 * Vuelve a la pantalla anterior en el Stack Navigator.
 */
export function goBack() {
  // Solo intenta volver si el contenedor de navegación está listo y hay una pantalla anterior
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

// Puedes añadir otras funciones de navegación aquí si las necesitas en el futuro,
// como reset, push, etc., usando navigationRef.
