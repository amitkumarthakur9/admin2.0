import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

interface DropdownItem {
    label: string;
    value: string;
}

const NewDropdownComponent = ({
    label = "",
    data = [],
    containerStyle,
    noIcon,
    value,
    setValue,
    searchOn = false,
}: {
    label: string;
    data: DropdownItem[];
    containerStyle?: any;
    noIcon?: boolean;
    value: string | number | null;
    setValue: React.Dispatch<any>;
    searchOn?: boolean;
}) => {
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
        <View
            style={{ ...styles.container, ...containerStyle }}
            className="lg:mr-2"
        >
            {renderLabel()}
            <Dropdown
                style={[
                    styles.dropdown,
                    { width: "100%" },
                    isFocus && { borderColor: "blue" },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={[
                    styles.inputSearchStyle,
                    isFocus && styles.inputSearchStyleFocus,
                ]}
                iconStyle={styles.iconStyle}
                data={data}
                search={searchOn}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={label}
                searchPlaceholder="Search"
                //@ts-ignore
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    setValue(item.value);
                    setIsFocus(false);
                }}
                renderLeftIcon={() =>
                    noIcon ? (
                        <></>
                    ) : (
                        <AntDesign
                            style={styles.icon}
                            color={isFocus ? "blue" : "black"}
                            name="Safety"
                            size={15}
                        />
                    )
                }
            />
        </View>
    );
};

export default NewDropdownComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    dropdown: {
        height: 39,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 3,
        paddingLeft: 16,
        paddingRight: 12,
        fontSize: 12,
        // zIndex: -1,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        // zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 12,
    },
    placeholderStyle: {
        fontSize: 12,
    },
    selectedTextStyle: {
        fontSize: 12,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 12,
        paddingLeft: 10,
        // fontWeight: 600,
        borderWidth: 1,
        // borderWidth: ,
    },
    inputSearchStyleFocus: {
        // borderColor: "blue",
        borderWidth: 0,
    },
});
