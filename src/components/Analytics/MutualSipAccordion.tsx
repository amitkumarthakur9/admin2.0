// NestedAccordion.js
import { background } from "native-base/lib/typescript/theme/styled-system";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { List, DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const MutualSipAccordion = ({ data }) => {
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
                            // borderBottomColor: "grey",
                            // height:16,
                            paddingVertical: 16,
                        }}
                    >
                        <View className="w-[19%] justify-center">
                            <Text className="font-semibold">RM Name</Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-semibold">
                                Live SIP Count
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-semibold">
                                Live SIP Amount
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-semibold">
                                Cancelled SIP Count
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-semibold">
                                Cancelled SIP Amount
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-semibold">
                                Transaction Failed SIP Count
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-semibold">
                                Transaction Failed SIP Amount
                            </Text>
                        </View>
                        <View className="w-[3%] justify-center items-center"></View>
                    </DataTable.Header>

                    {data.rmList.map((rm, index) => (
                        <RMRow key={index} rm={rm} />
                    ))}

                    <DataTable.Header
                        style={{
                            backgroundColor: "#bae1ff",
                            // borderBottomColor: "grey",
                            paddingVertical: 16,
                        }}
                    >
                        {/* <DataTable.Title className="font-bold" >Total</DataTable.Title> */}
                        <View className="w-[19%] justify-center">
                            <Text className="font-bold">Total</Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.liveSip}
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.liveAmount}
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.cancelledSip}
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.cancelledAmount}
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-bold">
                                {data.rmTotal.failedSip}
                            </Text>
                        </View>
                        <View className="w-[13%] justify-center">
                            <Text className="font-bold">
                                {" "}
                                {data.rmTotal.failedAmount}
                            </Text>
                        </View>
                        <View className="w-[3%] justify-center">
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
                }}
                onPress={() => setExpanded(!expanded)}
            >
                <View className="w-[19%] justify-center">
                    <Text>{rm.rmName}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{rm.liveSip}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{rm.liveAmount}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{rm.cancelledSip}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{rm.cancelledAmount}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{rm.failedSip}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{rm.failedAmount}</Text>
                </View>
                <View className="w-[3%] justify-center items-center">
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
                        // borderBottomColor: "grey",
                        // height:16,
                        paddingVertical: 16,
                    }}
                >
                    <View className="w-[19%] justify-center">
                        <Text className="font-semibold">IFA Name</Text>
                    </View>
                    <View className="w-[13%] justify-center">
                        <Text className="font-semibold">Live SIP Count</Text>
                    </View>
                    <View className="w-[13%] justify-center">
                        <Text className="font-semibold">Live SIP Amount</Text>
                    </View>
                    <View className="w-[13%] justify-center">
                        <Text className="font-semibold">
                            Cancelled SIP Count
                        </Text>
                    </View>
                    <View className="w-[13%] justify-center">
                        <Text className="font-semibold">
                            Cancelled SIP Amount
                        </Text>
                    </View>
                    <View className="w-[13%] justify-center">
                        <Text className="font-semibold">
                            Transaction Failed SIP Count
                        </Text>
                    </View>
                    <View className="w-[13%] justify-center">
                        <Text className="font-semibold">
                            Transaction Failed SIP Amount
                        </Text>
                    </View>
                    <View className="w-[3%] justify-center items-center"></View>
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
                <View className="w-[19%] justify-center">
                    <Text>{ifa.ifaName}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{ifa.liveSip}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{ifa.liveAmount}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{ifa.cancelledSip}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{ifa.cancelledAmount}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{ifa.failedSip}</Text>
                </View>
                <View className="w-[13%] justify-center">
                    <Text>{ifa.failedAmount}</Text>
                </View>
                <View className="w-[3%] justify-center items-center">
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
                    // borderBottomColor: "grey",
                }}
            >
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">User ID</Text>
                </View>
                <View className="w-[15%] justify-center">
                    <Text className="font-semibold">User Name</Text>
                </View>
                <View className="w-[25%] justify-center">
                    <Text className="font-semibold">Scheme Name</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Amount</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Status</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Transaction Date</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Start Date</Text>
                </View>
                <View className="w-[10%] justify-center">
                    <Text className="font-semibold">Cancelled Date</Text>
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
                    <View className="w-[15%] justify-center">
                        <Text>{client.name}</Text>
                    </View>
                    <View className="w-[25%] justify-center">
                        <Text>{client.scheme}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.amount}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.status}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.transactionDate}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.startDate}</Text>
                    </View>
                    <View className="w-[10%] justify-center">
                        <Text>{client.cancelledDate}</Text>
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

export default MutualSipAccordion;
