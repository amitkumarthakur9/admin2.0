import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const TableCard = ({ data }) => {
    console.log("TableCardData");
    console.log(data);

    const tailwindclass = {
        databox: "flex flex-col",
        textValue: "text-sm",
        textTitle: "text-base text-gray-600",
    };

    const data3 = [
        {
            id: "62",
            folioNumber: "30972558/81",
            currentValue: 101.868,
            investedValue: 100,
            xirr: 96.52,
            units: 0.677,
            account: {
                id: "295",
                clientId: "Y8W74",
                name: "Amol Kamble",
            },
            mutualfund: {
                name: "ICICI Prudential Infrastructure Fund",
                logoUrl: "https://www.fundexpert.in/cdn/logos-neo/icici.png",
                deliveryType: {
                    id: 2,
                    name: "Regular",
                },
                optionType: {
                    id: 2,
                    name: "Growth",
                },
                dividendType: {
                    id: 1,
                    name: "NA",
                },
            },
        },
        {
            id: "50",
            folioNumber: "30358411/07",
            currentValue: 299.055,
            investedValue: 297,
            xirr: 7.93,
            units: 0.855,
            account: {
                id: "298",
                clientId: "YIV8M",
                name: "Hardik Kumbhani",
            },
            mutualfund: {
                name: "ICICI Prudential Liquid Fund",
                logoUrl: "https://www.fundexpert.in/cdn/logos-neo/icici.png",
                deliveryType: {
                    id: 2,
                    name: "Regular",
                },
                optionType: {
                    id: 2,
                    name: "Growth",
                },
                dividendType: {
                    id: 1,
                    name: "NA",
                },
            },
        },
        {
            id: "51",
            folioNumber: "30358433/38",
            currentValue: 128.366,
            investedValue: 127.691,
            xirr: 2.53,
            units: 0.367,
            account: {
                id: "298",
                clientId: "YIV8M",
                name: "Hardik Kumbhani",
            },
            mutualfund: {
                name: "ICICI Prudential Liquid Fund",
                logoUrl: "https://www.fundexpert.in/cdn/logos-neo/icici.png",
                deliveryType: {
                    id: 2,
                    name: "Regular",
                },
                optionType: {
                    id: 2,
                    name: "Growth",
                },
                dividendType: {
                    id: 1,
                    name: "NA",
                },
            },
        },
    ];

    const transformedData = data3.map((item) => ({
        id: item.id,
        Name: item.account.name,
        FolioNumber: item.folioNumber,
        CurrentValue: item.currentValue,
    }));

    // Utility function to convert camel case to spaced format
    const formatKey = (key) => {
        return key.replace(/([a-z])([A-Z])/g, "$1 $2");
    };

    const DataValue = ({ data }) => {
        return (
            <View>
                {data.map((item, index) => (
                    <View
                        key={index}
                        className="flex flex-row flex-wrap gap-4 justify-between"
                    >
                        {Object.entries(item).map(([key, value]) => (
                            <View className="w-5/12">
                                <View
                                    key={key}
                                    className={tailwindclass.databox}
                                >
                                    <Text className={tailwindclass.textValue}>
                                        {String(value)}
                                    </Text>
                                    <Text className={tailwindclass.textTitle}>
                                        {formatKey(key)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return data.map((item) => (
        <View key={item.id} style={styles.card}>
            <View className="">
                <View>
                    <DataValue data={[item]} />
                    <View className="flex flex-row w-10/12 justify-center">
                    <Pressable
                        onPress={() => router.push("clients/${client.id}")}
                    >
                        <Icon name="ellipsis-v" size={18} color="grey" />
                    </Pressable>
                </View>
                </View>
                
            </View>
        </View>
    ));
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 20,
        margin: 10,
        backgroundColor: "#fffff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        marginTop: 0,
        fontSize: 20,
        fontWeight: "bold",
    },
    data: {
        marginTop: 10,
    },
    dataItem: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default TableCard;
