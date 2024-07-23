// NestedAccordion.js
import { background } from "native-base/lib/typescript/theme/styled-system";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { List, DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

// RM Name
// Lumpsum Amount
// Lumpsum Count
// Redemption Amount
// Redemption Count
// CAMS Transfer-in Amount
// CAMS Transfer-in Count
// Switch in Amount
// Switch in Count
// Switch out Amount
// Switch out Count
// SIP Amount
// SIP Count

const MutualLumpsumAccordion = ({ data }) => {
    const [expanded, setExpanded] = useState(false);

    console.log("rm list");
    console.table(data);

    return (
        <ScrollView>
            <View style={styles.details}>
                <DataTable>
                    <DataTable.Header
                        style={{
                            backgroundColor: "#CDF0FF",
                            // borderBottomColor: "#CDF0FF",
                            borderWidth: 0,
                            paddingVertical: 14,
                        }}
                    >
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">RM Name</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">
                                Lumpsum Count
                            </Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Lumpsum Amount</Text>
                        </View>
                        
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Redemption Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Redemption Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">CAMS Transfer-in Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">CAMS Transfer-in Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch in Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch in Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch out Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch out Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">SIP Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">SIP Amount</Text>
                        </View>

                        <View className="w-[2.5%] justify-center items-center"></View>
                    </DataTable.Header>

                    {data.rmList.map((rm, index) => (
                        <RMRow key={index} rm={rm} />
                    ))}

                    <DataTable.Header
                        style={{
                            backgroundColor: "#bae1ff",
                            // borderBottomColor: "grey",
                            borderWidth: 0,
                            paddingVertical: 14,
                        }}
                    >
                        {/* <DataTable.Title className="font-bold" >Total</DataTable.Title> */}
                        <View className="w-[30%] justify-center">
                            <Text className="font-bold">Total</Text>
                        </View>
                        <View className="w-[30%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.lumpCount}
                            </Text>
                        </View>
                        <View className="w-[30%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.lumpAmount}
                            </Text>
                        </View>

                        <View className="w-[10%] justify-center">
                            <Text className="font-bold"></Text>
                        </View>
                    </DataTable.Header>
                </DataTable>
            </View>
        </ScrollView>
    );
};

const RMRow = ({ rm }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <DataTable.Row
                style={{
                    backgroundColor: "#ECF9FF",
                    // borderBottomColor: "grey",
                    // borderWidth: 0,
                }}
                onPress={() => setExpanded(!expanded)}
            >
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.rmName}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.lumpCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.lumpAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.redemptionAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.redemptionCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.CAMSTransferInAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.CAMSTransferInCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.switchInAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.switchInCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.switchOutAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.switchOutCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.sipAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{rm.sipCount}</Text>
                </View>
                <View className="w-[2.5%] justify-center items-center">
                    {!expanded ? (
                        <Icon name="caret-down" size={16} />
                    ) : (
                        <Icon name="caret-up" size={16} />
                    )}
                </View>
            </DataTable.Row>

            {expanded && (
                <View style={styles.details}>
                    <RMAccordion ifalist={rm.ifalist} ifaTotal={rm.ifaTotal} />
                </View>
            )}
        </>
    );
};

const RMAccordion = ({ ifalist, ifaTotal }) => {
    const [expanded, setExpanded] = useState(false);

    console.log("RMaccordian");
    console.table(ifalist);

    return (
        <View style={styles.details}>
            <DataTable>
                <DataTable.Header
                    style={{
                        backgroundColor: "#D4FCF9",
                        // borderBottomColor: "#D4FCF9",
                        borderWidth: 0,
                    paddingVertical: 14,
                    }}
                >
                    <View className="w-[7.5%] justify-center">
                        <Text className="font-semibold">IFA Name</Text>
                    </View>
                    <View className="w-[7.5%] justify-center">
                        <Text className="font-semibold">Lumpsum Count</Text>
                    </View>

                    <View className="w-[7.5%] justify-center">
                        <Text className="font-semibold">Lumpsum Amount</Text>
                    </View>
                    <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Redemption Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Redemption Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">CAMS Transfer-in Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">CAMS Transfer-in Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch in Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch in Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch out Count</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">Switch out Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">SIP Amount</Text>
                        </View>
                        <View className="w-[7.5%] justify-center">
                            <Text className="font-semibold">SIP Amount</Text>
                        </View>

                    
                    <View className="w-[2.5%] justify-center items-center"></View>
                </DataTable.Header>
                {ifalist.map((ifa, index) => (
                    <IFAAccordion key={index} ifa={ifa} />
                ))}
            </DataTable>
        </View>
        // </List.Accordion>
    );
};

const IFAAccordion = ({ ifa }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <DataTable.Row
                style={{
                    backgroundColor: "#ECFFFE",
                    // borderBottomColor: "grey",
                }}
                onPress={() => setExpanded(!expanded)}
            >
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.ifaName}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.lumpCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.lumpAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.redemptionAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.redemptionCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.CAMSTransferInAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.CAMSTransferInCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.switchInAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.switchInCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.switchOutAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.switchOutCount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.sipAmount}</Text>
                </View>
                <View className="w-[7.5%] justify-center">
                    <Text>{ifa?.sipCount}</Text>
                </View>


                <View className="w-[2.5%] justify-center items-center">
                    {!expanded ? (
                        <Icon name="caret-down" size={16} />
                    ) : (
                        <Icon name="caret-up" size={16} />
                    )}
                </View>
            </DataTable.Row>

            {expanded && (
                <View style={styles.details}>
                    <ClientTable clients={ifa.clientList} />
                </View>
            )}
        </>
    );
};

const ClientTable = ({ clients }) => {
    // const clients = ifaList.clientListclient;
    // const clientTotal = ifaList.clientTotal;
    return (
        <DataTable>
            <DataTable.Header
                style={{
                    backgroundColor: "#D5F1DB",
                    // borderBottomColor: "#D5F1DB",
                    borderWidth: 0,
                    paddingVertical: 14,
                }}
            >
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">User ID</Text>
                </View>
                <View className="w-[20%] justify-center">
                    <Text className="font-semibold">User Name</Text>
                </View>
                <View className="w-[20%] justify-center">
                    <Text className="font-semibold">Scheme Name</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Amount</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Transaction Type</Text>
                </View>
                <View className="w-[15%] justify-center">
                    <Text className="font-semibold">Transaction Date</Text>
                </View>
                <View className="w-[15%] justify-center">
                    <Text className="font-semibold">Start Date</Text>
                </View>
            </DataTable.Header>
            {clients.map((client, index) => (
                <DataTable.Row
                    style={{
                        backgroundColor: "#F3FEEF",
                        // borderBottomColor: "grey",
                    }}
                    key={index}
                >
                    <View className="w-[10%] justify-center">
                        <Text>{client.id}</Text>
                    </View>
                    <View className="w-[20%] justify-center">
                        <Text>{client.name}</Text>
                    </View>
                    <View className="w-[20%] justify-center">
                        <Text>{client.scheme}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.amount}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.transactionType}</Text>
                    </View>
                    <View className="w-[15%] justify-center">
                        <Text>{client.transactionDate}</Text>
                    </View>
                    <View className="w-[15%] justify-center">
                        <Text>{client.startDate}</Text>
                    </View>
                </DataTable.Row>
            ))}
        </DataTable>
    );
};

const styles = StyleSheet.create({
    details: {
        padding: 10,
    },
});

export default MutualLumpsumAccordion;
