import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomCheckbox = ({ label, isChecked, onChange }) => {
    return (
        <Pressable onPress={onChange} style={styles.checkboxContainer}>
            <View style={[
                styles.checkboxBase,
                isChecked && styles.checkboxChecked,
            ]}>
                {isChecked && (
                    <MaterialIcons name="check" size={14} color="white" />
                )}
            </View>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start',
        // backgroundColor: "black",
    },
    checkboxBase: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#C1C2C4',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        borderColor: '#114EA8',
        backgroundColor: '#114EA8',
    },
    checkboxLabel: {
        fontSize: 12,
        color: '#333',
        fontWeight: "600",
    },
});

export default CustomCheckbox;
