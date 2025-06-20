import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigates to a specific screen within the Stack Navigator.
 * @param name The name of the route (screen) to navigate to.
 * Must be a key defined in RootStackParamList.
 * @param params (Optional) Parameters to pass to the screen.
 */
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params);
  } else {
    console.warn('NavigationContainer no está listo para navegar.');
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
