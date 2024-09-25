import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { dateFormat, dateTimeFormat } from "src/helper/DateUtils";
import RemoteApi from "src/services/RemoteApi";

const MutualLumpsumAccordion = ({ data, appliedFilers }) => {
    console.log(data);
    const [totals, setTotals] = useState({
        purchaseAmount: 0,
        purchaseCount: 0,
        redemptionAmount: 0,
        redemptionCount: 0,
    });

    const calculateTotals = () => {
        const totalData = data.reduce(
            (acc, item) => {
                item.info.forEach((infoItem) => {
                    if (infoItem.type === "Purchase") {
                        acc.purchaseAmount += infoItem.amount;
                        acc.purchaseCount += infoItem.count;
                    } else if (infoItem.type === "Redemption") {
                        acc.redemptionAmount += infoItem.amount;
                        acc.redemptionCount += infoItem.count;
                    }
                });
                return acc;
            },
            {
                purchaseAmount: 0,
                purchaseCount: 0,
                redemptionAmount: 0,
                redemptionCount: 0,
            }
        );

        setTotals(totalData);
    };

    useEffect(() => {
        calculateTotals();
    }, [data]);

    return (
        <ScrollView>
            <View style={styles.details}>
                <View style={styles.RmtableHeader}>
                    {renderHeaderCell("RM Name", "7.5%")}
                    {renderHeaderCell("Lumpsum Count", "7.5%")}
                    {renderHeaderCell("Lumpsum Amount", "7.5%")}
                    {renderHeaderCell("Redemption Count", "7.5%")}
                    {renderHeaderCell("Redemption Amount", "7.5%")}
                    {renderHeaderCell("CAMS Transfer-in Count", "7.5%")}
                    {renderHeaderCell("CAMS Transfer-in Amount", "7.5%")}
                    {renderHeaderCell("Switch in Count", "7.5%")}
                    {renderHeaderCell("Switch in Amount", "7.5%")}
                    {renderHeaderCell("Switch out Count", "7.5%")}
                    {renderHeaderCell("Switch out Amount", "7.5%")}
                    {renderHeaderCell("SIP Amount", "7.5%")}
                    {renderHeaderCell("SIP Amount", "7.5%")}
                    {renderHeaderCell("", "7.5%")}
                </View>

                {data.map((rm, index) => (
                    <RMRow key={index} rm={rm} appliedFilers={appliedFilers} />
                ))}

                <View style={styles.tableFooter}>
                    {renderCell("Total", "7.5%")}
                    {renderCell(totals.purchaseCount, "7.5%")}
                    {renderCell(totals.purchaseAmount.toFixed(2), "7.5%")}
                    {renderCell(totals.redemptionCount, "7.5%")}
                    {renderCell(totals.redemptionAmount.toFixed(2), "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("NA", "7.5%")}
                    {renderCell("", "7.5%")}
                </View>
            </View>
        </ScrollView>
    );
};

const RMRow = ({ rm, appliedFilers }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ifaList, setIfaList] = useState([]);

    const handleExpand = async () => {
        const newExpanded = !expanded;
        setExpanded(newExpanded);

        if (newExpanded) {
            setLoading(true);

            const appliedFilters = () => {
                if (appliedFilers[0].key === "") {
                    return [
                        {
                            key: "createdAt",
                            operator: "between",
                            value: ["2024-01-01", "2024-12-31"],
                        },
                    ];
                } else {
                    return appliedFilers;
                }
            };

            const data = { filters: appliedFilters };
            try {
                const response: any = await RemoteApi.post(
                    `mutualfund-analytics/transaction/rm/${rm.id}`,
                    data
                );

                if (response.message === "Success") {
                    setIfaList(response.data);
                } else {
                    // Handle the error if needed
                }
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <TouchableOpacity onPress={handleExpand} style={styles.RmTableRow}>
                {renderCell(rm?.name, "7.5%")}
                {renderCell(
                    rm.info.find((i) => i.type === "Purchase")?.count || 0,
                    "7.5%"
                )}
                {renderCell(
                    rm.info
                        .find((i) => i.type === "Purchase")
                        ?.amount.toFixed(2) || 0,
                    "7.5%"
                )}
                {renderCell(
                    rm.info.find((i) => i.type === "Redemption")?.count || 0,
                    "7.5%"
                )}
                {renderCell(
                    rm.info
                        .find((i) => i.type === "Redemption")
                        ?.amount.toFixed(2) || 0,
                    "7.5%"
                )}
                {renderCell("NA", "7.5%")} {/* CAMS Transfer-in Count */}
                {renderCell("NA", "7.5%")} {/* CAMS Transfer-in Amount */}
                {renderCell("NA", "7.5%")} {/* Switch in Count */}
                {renderCell("NA", "7.5%")} {/* Switch in Amount */}
                {renderCell("NA", "7.5%")} {/* Switch out Count */}
                {renderCell("NA", "7.5%")} {/* Switch out Amount */}
                {renderCell("NA", "7.5%")} {/* SIP Amount */}
                {renderCell("NA", "7.5%")} {/* SIP Amount */}
                <View style={styles.iconCell}>
                    <Icon
                        name={!expanded ? "caret-down" : "caret-up"}
                        size={16}
                    />
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.details}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                        <RMAccordion
                            ifalist={ifaList}
                            ifaTotal={rm.ifaTotal}
                            appliedFilers={appliedFilers}
                        />
                    )}
                </View>
            )}
        </>
    );
};

const RMAccordion = ({ ifalist, ifaTotal, appliedFilers }) => {
    return (
        <View style={styles.details}>
            <View style={styles.ifaTableHeader}>
                {renderHeaderCell("IFA Name", "7.5%")}
                {renderHeaderCell("Lumpsum Count", "7.5%")}
                {renderHeaderCell("Lumpsum Amount", "7.5%")}
                {renderHeaderCell("Redemption Count", "7.5%")}
                {renderHeaderCell("Redemption Amount", "7.5%")}
                {renderHeaderCell("CAMS Transfer-in Count", "7.5%")}
                {renderHeaderCell("CAMS Transfer-in Amount", "7.5%")}
                {renderHeaderCell("Switch in Count", "7.5%")}
                {renderHeaderCell("Switch in Amount", "7.5%")}
                {renderHeaderCell("Switch out Count", "7.5%")}
                {renderHeaderCell("Switch out Amount", "7.5%")}
                {renderHeaderCell("SIP Amount", "7.5%")}
                {renderHeaderCell("SIP Amount", "7.5%")}
                {renderHeaderCell("", "7.5%")}
            </View>
            {ifalist.map((ifa, index) => (
                <IFAAccordion
                    key={index}
                    ifa={ifa}
                    appliedFilers={appliedFilers}
                />
            ))}
        </View>
    );
};

const IFAAccordion = ({ ifa, appliedFilers }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);

    const handleExpand = async () => {
        const newExpanded = !expanded;
        setExpanded(newExpanded);

        if (newExpanded) {
            setLoading(true);

            const appliedFilters = () => {
                if (appliedFilers[0].key === "") {
                    return [
                        {
                            key: "createdAt",
                            operator: "between",
                            value: ["2024-01-01", "2024-12-31"],
                        },
                    ];
                } else {
                    return appliedFilers;
                }
            };

            const data = { filters: appliedFilters };

            try {
                const response: any = await RemoteApi.post(
                    `mutualfund-analytics/transaction/distributor/${ifa.id}`,
                    data
                );

                if (response.message === "Success") {
                    setClients(response.data);
                } else {
                    // Handle the error if needed
                }
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <TouchableOpacity onPress={handleExpand} style={styles.ifaTableRow}>
                {renderCell(ifa?.name, "7.5%")}
                {renderCell(
                    ifa.info.find((i) => i.type === "Purchase")?.count || 0,
                    "7.5%"
                )}
                {renderCell(
                    ifa.info
                        .find((i) => i.type === "Purchase")
                        ?.amount.toFixed(2) || 0,
                    "7.5%"
                )}
                {renderCell(
                    ifa.info.find((i) => i.type === "Redemption")?.count || 0,
                    "7.5%"
                )}
                {renderCell(
                    ifa.info
                        .find((i) => i.type === "Redemption")
                        ?.amount.toFixed(2) || 0,
                    "7.5%"
                )}
                {renderCell("NA", "7.5%")} {/* CAMS Transfer-in Count */}
                {renderCell("NA", "7.5%")} {/* CAMS Transfer-in Amount */}
                {renderCell("NA", "7.5%")} {/* Switch in Count */}
                {renderCell("NA", "7.5%")} {/* Switch in Amount */}
                {renderCell("NA", "7.5%")} {/* Switch out Count */}
                {renderCell("NA", "7.5%")} {/* Switch out Amount */}
                {renderCell("NA", "7.5%")} {/* SIP Amount */}
                {renderCell("NA", "7.5%")} {/* SIP Amount */}
                <View style={styles.iconCell}>
                    <Icon
                        name={!expanded ? "caret-down" : "caret-up"}
                        size={16}
                    />
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.details}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                        <ClientTable clients={clients} />
                    )}
                </View>
            )}
        </>
    );
};

const ClientTable = ({ clients }) => {
    return (
        <View>
            <View style={styles.clientTableHeader}>
                {renderHeaderCell("User ID", "10%")}
                {renderHeaderCell("User Name", "20%")}
                {renderHeaderCell("Scheme Name", "20%")}
                {renderHeaderCell("Amount", "10%")}
                {renderHeaderCell("Transaction Type", "10%")}
                {renderHeaderCell("Initiation Date", "15%")}
                {renderHeaderCell("Allotment Date", "15%")}
            </View>
            {clients.map((client, index) => (
                <View key={index} style={styles.clientTableRow}>
                    {renderCell(client?.account.id, "10%")}
                    {renderCell(client?.account.name, "20%")}
                    {renderCell(client?.mutualfund.name, "20%")}
                    {renderCell(client?.amount.toFixed(2), "10%")}
                    {renderCell(client?.type, "10%")}
                    {renderCell(dateTimeFormat(client?.initiationDate), "15%")}
                    {renderCell(dateTimeFormat(client?.allotmentDate), "15%")}
                    {/* <Text style={styles.cell}>{client?.cancelledDate}</Text> */}
                </View>
            ))}
        </View>
    );
};

const renderHeaderCell = (text, width) => (
    <View style={[styles.headerCell, { width }]}>
        <Text className="font-semibold" style={styles.text}>{text}</Text>
    </View>
);

const renderCell = (text, width) => (
    <View style={[styles.cell, { width }]}>
        <Text style={styles.text}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    details: {
        padding: 10,
    },
    RmtableHeader: {
        flexDirection: "row",
        backgroundColor: "#CDF0FF",
        paddingVertical: 14,
    },
    ifaTableHeader: {
        flexDirection: "row",
        backgroundColor: "#D4FCF9",
        paddingVertical: 14,
    },
    clientTableHeader: {
        flexDirection: "row",
        backgroundColor: "#D5F1DB",
        paddingVertical: 14,
    },
    ifaTableRow: {
        flexDirection: "row",
        backgroundColor: "#ECFFFE",
        paddingVertical: 10,
    },
    RmTableRow: {
        flexDirection: "row",
        backgroundColor: "#ECF9FF",
        paddingVertical: 10,
    },
    clientTableRow: {
        flexDirection: "row",
        backgroundColor: "#F3FEEF",
        paddingVertical: 10,
    },
    tableFooter: {
        flexDirection: "row",
        backgroundColor: "#bae1ff",
        paddingVertical: 14,
    },
    cell: {
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 5,
    },
    text: {
        textAlign: "left", // Align text to the left
        width: "100%", // Ensure the text occupies the full width of the cell
    },
    headerCell: {
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        padding: 5,
    },
    footerCell: {
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        padding: 5,
    },
    iconCell: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default MutualLumpsumAccordion;
