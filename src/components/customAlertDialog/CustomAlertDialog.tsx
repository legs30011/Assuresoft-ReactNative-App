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

interface CustomAlertDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  imageUrl?: string;
  imageAltText?: string;
  onConfirm?: () => void; 
  confirmButtonText?: string; 
  cancelButtonText?: string; 
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  isVisible,
  title,
  message,
  onClose,
  imageUrl,
  imageAltText,
  onConfirm,
  confirmButtonText = 'Confirm', 
  cancelButtonText = 'Cancel',
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
            {onConfirm && ( 
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={modalStyles.buttonText}>{confirmButtonText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]} 
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
    backgroundColor: '#1a1a1a', 
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxHeight: '70%', 
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EEFF00',

  },
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
    borderRadius: 50,
    backgroundColor: '#333', 
  },
  modalMessageContainer: {
    maxHeight: 150,
    marginBottom: 20,
  },
  modalMessage: {
    color: '#DDDDDD',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 12, 
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: { 
    backgroundColor: '#E73B5B',
  },
  cancelButton: { 
    backgroundColor: '#666666', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CustomAlertDialog;
