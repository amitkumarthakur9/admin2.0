import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { Box, Toast } from "native-base";

const Toaster = ({ visible, message }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={() => {}}
        >
            <View style={styles.toastContainer}>
                <View style={styles.toast}>
                    <Text style={styles.toastMessage}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 50,
    },
    toast: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    toastMessage: {
        color: "white",
        fontSize: 14,
    },
});

export default Toaster;

export const showToast = (message) => {
    Toast.show({
        render: () => (
            <Toaster
                visible={true}  // Make sure it's visible when the toast is triggered
                message={message} // Pass the message correctly
            />
        ),
        duration: 2000,
        placement: "top",
        style: {
            zIndex: 9999, // Ensure it's above everything
            elevation: 9999, // Elevation for Android
        },
    });
};
