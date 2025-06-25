/* eslint-disable quotes */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';

// CustomAlertDialogProps interface - updated to include onConfirm and button texts
interface CustomAlertDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  imageUrl?: string; // Made optional to match PokemonListItemDisplay
  imageAltText?: string;
  onConfirm?: () => void; // New optional prop for confirmation action
  confirmButtonText?: string; // New optional prop for confirm button text
  cancelButtonText?: string; // New optional prop for cancel button text
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  isVisible,
  title,
  message,
  onClose,
  imageUrl,
  imageAltText,
  onConfirm, // Destructure new prop
  confirmButtonText = 'Confirm', // Default text
  cancelButtonText = 'Cancel', // Default text
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={modalStyles.modalImage}
              accessibilityLabel={imageAltText || 'Image related to modal message'}
              onError={(e) => console.log("Failed to load modal image:", e.nativeEvent.error)}
            />
          )}
          <ScrollView style={modalStyles.modalMessageContainer}>
            <Text style={modalStyles.modalMessage}>{message}</Text>
          </ScrollView>
          <View style={modalStyles.buttonContainer}>
            {onConfirm && ( // Only show confirm button if onConfirm is provided
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={modalStyles.buttonText}>{confirmButtonText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]} // Use cancelButton style for onClose
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>{cancelButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1a1a1a', // Your original color
    borderRadius: 20,
    padding: 30, // Your original padding
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%', // Your original width
    maxHeight: '70%', // Your original maxHeight
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EEFF00',
    // fontFamily: 'Inter-Bold', // Re-add if you have this font setup
  },
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
    borderRadius: 50, // Your original borderRadius
    backgroundColor: '#333', // Your original backgroundColor
  },
  modalMessageContainer: {
    maxHeight: 150, // Your original maxHeight
    marginBottom: 20,
  },
  modalMessage: {
    color: '#DDDDDD',
    textAlign: 'center',
    fontSize: 16,
    // fontFamily: 'Inter-Regular', // Re-add if you have this font setup
    lineHeight: 22,
  },
  buttonContainer: { // New style for button layout
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: { // Base button style
    borderRadius: 10,
    padding: 12, // Match your closeButton padding
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: { // Specific style for confirm button
    backgroundColor: '#E73B5B',
  },
  cancelButton: { // Specific style for cancel button (used for onClose)
    backgroundColor: '#666666', // A different shade for cancel
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    // fontFamily: 'Inter-Bold', // Re-add if you have this font setup
  },
});

export default CustomAlertDialog;
