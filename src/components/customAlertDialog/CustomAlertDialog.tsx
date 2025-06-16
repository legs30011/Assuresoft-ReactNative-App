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

// CustomAlertDialogProps interface
interface CustomAlertDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  imageUrl?: string;
  imageAltText?: string;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({ isVisible, title, message, onClose, imageUrl, imageAltText }) => {
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
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={onClose}
          >
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    fontFamily: 'Inter-Bold',
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
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#E73B5B',
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});

export default CustomAlertDialog;
