import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
];

const DropdownComponent = ({ label = "" }) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <></>
                // <Text selectable style={[styles.label, isFocus && { color: 'blue' }]}>
                //     Dropdown label
                // </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.container} className="lg:mr-2">
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                iconColor="#484848"
                data={data}
                search={false}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={label}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    setValue(item.value);
                    setIsFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? "blue" : "black"}
                        name="Safety"
                        size={15}
                    />
                )}
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    dropdown: {
        height: 39,
        borderColor: "#484848",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 12,
        color: "#484848",
    },
    icon: {
        marginRight: 5,
        color: "#484848",
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 12,
        color: "#484848",
    },
    placeholderStyle: {
        fontSize: 12,
        color: "#484848",
    },
    selectedTextStyle: {
        fontSize: 12,
        color: "#484848",
    },
    iconStyle: {
        width: 20,
        height: 20,
        // color: "#484848"
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 12,
        color: "#484848",
    },
});
