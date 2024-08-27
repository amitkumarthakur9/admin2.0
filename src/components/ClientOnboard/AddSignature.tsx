import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddSignature = ({onNext, onClose, onPrevious, initialValues }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="black" />
                </Pressable>

                <Text style={styles.title}>Add Signature</Text>
                <Text style={styles.subTitle}>Please sign in the given area</Text>

                <View style={styles.uploadContainer}>
                    <Ionicons
                        name="cloud-upload-outline"
                        size={64}
                        color="#A0AEC0"
                    />
                    <Text style={styles.uploadText}>
                        Maximum file size: 2 MB (PNG/JPG format only)
                    </Text>
                    <Text style={styles.uploadText}>
                        You can also drag and drop the file
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.skipButton}
                        onPress={onPrevious}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </Pressable>
                    <Pressable style={styles.disabledButton}>
                        <Text style={styles.disabledButtonText}>Save and Continue</Text>
                    </Pressable>
                    <Pressable
                                        style={styles.saveButton}
                                        onPress={() => onNext()}
                                    >
                                        <Text style={styles.saveButtonText}>
                                            Save Nominee
                                        </Text>
                                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 3, // Add shadow on Android
        shadowColor: '#000', // Add shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 14,
        marginBottom: 20,
        color: '#718096',
    },
    uploadContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A0AEC0',
        borderRadius: 10,
        padding: 40,
        marginBottom: 20,
    },
    uploadText: {
        color: '#A0AEC0',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    skipButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#0066cc',
        width: '48%',
    },
    skipButtonText: {
        fontSize: 16,
        color: '#0066cc',
    },
    disabledButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#A0AEC0',
        width: '48%',
    },
    disabledButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    saveButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#0066cc",
        width: "48%",
    },
    saveButtonText: {
        fontSize: 16,
        color: "#ffffff",
    },
});

export default AddSignature;
