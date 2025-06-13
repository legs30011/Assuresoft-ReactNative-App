import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation'; 
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
    console.warn('NavigationContainer no está listo para navegar.');
  }
}
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}


