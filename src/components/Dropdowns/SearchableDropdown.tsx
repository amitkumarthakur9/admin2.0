import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoteApi from "src/services/RemoteApi";

const SearchableDropdown = ({ endpoint, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchOptions = async (query) => {
        setIsLoading(true);
        try {
            const response: any = await RemoteApi.get(
                `${endpoint}?query=${query}`
            );
            if (response.code === 200) {
                setOptions(
                    response.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))
                );
            } else {
                alert("Failed to fetch options");
            }
        } catch (error) {
            alert("An error occurred while fetching the options");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 3) {
                fetchOptions(searchQuery);
            } else {
                setOptions([]);
            }
        }, 500); // 0.5 seconds

        // Cleanup function to cancel the timeout if the component is unmounted or if searchQuery changes
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setSearchQuery("");
        setOptions([]);
        setShowDropdown(false);
        onSelect(item); // Pass selected item to the parent component
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Text style={styles.buttonText}>
                    {selectedItem ? selectedItem.label : "Bank Name"}
                </Text>
                <Icon name="chevron-down" size={24} color="#000" />
            </TouchableOpacity>
            {showDropdown && (
                <View style={styles.dropdown}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter atleast 3 character to search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {isLoading && (
                        <ActivityIndicator size="small" color="#0000ff" />
                    )}
                    {options.length > 0 && (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => handleSelectItem(item)}
                                    >
                                        <Text>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        zIndex: 10000,
        // paddingHorizontal: 20,
        // paddingLeft: 20,
        // paddingRight: 28,
        // borderColor: "gray",
        // borderWidth: 0.5,
        paddingBottom: 8,
    },
    button: {
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        zIndex: 10000,
        borderColor: "gray",
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 12,
    },
    dropdown: {
        position: "absolute",
        top: 45,
        width: "100%",
        backgroundColor: "#fff",
        borderColor: "#ccc",
        // borderWidth: 1,
        borderRadius: 4,
        zIndex: 10000,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
        marginBottom: 5,
        zIndex: 10000,
    },
    listContainer: {
        maxHeight: 150,
        zIndex: 10000,
    },
    listItem: {
        padding: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        zIndex: 10000,
    },
});

export default SearchableDropdown;
