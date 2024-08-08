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
import { MutualSIPAnalytics } from "src/interfaces/MutualSIPanalyticsInterface";
import RemoteApi from "src/services/RemoteApi";

const MutualSipAccordion = ({ data, appliedFilers }) => {
    const [totals, setTotals] = useState({
        canceledSipAmount: 0,
        canceledSipCount: 0,
        successSipAmount: 0,
        successSipCount: 0,
        failedSipAmount: 0,
        failedSipCount: 0,
    });

    const calculateTotals = () => {
        const totalData = data.reduce(
            (acc, item) => {
                acc.canceledSipAmount += item.canceledSipAmount;
                acc.canceledSipCount += item.canceledSipCount;
                acc.successSipAmount += item.successSipAmount;
                acc.successSipCount += item.successSipCount;
                acc.failedSipAmount += item.failedSipAmount;
                acc.failedSipCount += item.failedSipCount;
                return acc;
            },
            {
                canceledSipAmount: 0,
                canceledSipCount: 0,
                successSipAmount: 0,
                successSipCount: 0,
                failedSipAmount: 0,
                failedSipCount: 0,
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
                    <Text style={styles.headerCell}>RM Name</Text>
                    <Text style={styles.headerCell}>Live SIP Count</Text>
                    <Text style={styles.headerCell}>Live SIP Amount</Text>
                    <Text style={styles.headerCell}>Cancelled SIP Count</Text>
                    <Text style={styles.headerCell}>Cancelled SIP Amount</Text>
                    <Text style={styles.headerCell}>
                        Transaction Failed SIP Count
                    </Text>
                    <Text style={styles.headerCell}>
                        Transaction Failed SIP Amount
                    </Text>
                    <View style={styles.iconCell}></View>
                </View>

                {data.map((rm, index) => (
                    <RMRow key={index} rm={rm} appliedFilers={appliedFilers} />
                ))}

                <View style={styles.tableFooter}>
                    <Text style={styles.footerCell}>Total</Text>
                    <Text style={styles.footerCell}>
                        {totals.successSipCount}
                    </Text>
                    <Text style={styles.footerCell}>
                        {totals.successSipAmount}
                    </Text>
                    <Text style={styles.footerCell}>
                        {totals.canceledSipCount}
                    </Text>
                    <Text style={styles.footerCell}>
                        {totals.canceledSipAmount}
                    </Text>
                    <Text style={styles.footerCell}>
                        {totals.failedSipCount}
                    </Text>
                    <Text style={styles.footerCell}>
                        {totals.failedSipAmount}
                    </Text>
                    <View style={styles.iconCell}></View>
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

            const data = {
                filters: appliedFilers,
            };

            try {
                const response: any = await RemoteApi.post(
                    `mutualfund-analytics/sip/rm/${rm.id}`,
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
                <Text style={styles.cell}>{rm?.name}</Text>
                <Text style={styles.cell}>{rm?.successSipCount}</Text>
                <Text style={styles.cell}>{rm?.successSipAmount}</Text>
                <Text style={styles.cell}>{rm?.canceledSipCount}</Text>
                <Text style={styles.cell}>{rm?.canceledSipAmount}</Text>
                <Text style={styles.cell}>{rm?.failedSipCount}</Text>
                <Text style={styles.cell}>{rm?.failedSipAmount}</Text>
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
                <Text style={styles.headerCell}>IFA Name</Text>
                <Text style={styles.headerCell}>Live SIP Count</Text>
                <Text style={styles.headerCell}>Live SIP Amount</Text>
                <Text style={styles.headerCell}>Cancelled SIP Count</Text>
                <Text style={styles.headerCell}>Cancelled SIP Amount</Text>
                <Text style={styles.headerCell}>
                    Transaction Failed SIP Count
                </Text>
                <Text style={styles.headerCell}>
                    Transaction Failed SIP Amount
                </Text>
                <View style={styles.iconCell}></View>
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

            const data = {
                filters: appliedFilers,
            };

            try {
                const response: any = await RemoteApi.post(
                    `mutualfund-analytics/sip/distributor/${ifa.id}`,
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
                <Text style={styles.cell}>{ifa?.name}</Text>
                <Text style={styles.cell}>{ifa?.successSipCount}</Text>
                <Text style={styles.cell}>{ifa?.successSipAmount}</Text>
                <Text style={styles.cell}>{ifa?.canceledSipCount}</Text>
                <Text style={styles.cell}>{ifa?.canceledSipAmount}</Text>
                <Text style={styles.cell}>{ifa?.failedSipCount}</Text>
                <Text style={styles.cell}>{ifa?.failedSipAmount}</Text>
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
                <Text style={styles.headerCell}>User ID</Text>
                <Text style={styles.headerCell}>User Name</Text>
                <Text style={styles.headerCell}>Scheme Name</Text>
                <Text style={styles.headerCell}>Amount</Text>
                <Text style={styles.headerCell}>Status</Text>
                <Text style={styles.headerCell}>Transaction Date</Text>
                <Text style={styles.headerCell}>Start Date</Text>
                <Text style={styles.headerCell}>Cancelled Date</Text>
            </View>
            {clients.map((client, index) => (
                <View key={index} style={styles.clientTableRow}>
                    <Text style={styles.cell}>{client?.account.id}</Text>
                    <Text style={styles.cell}>{client?.account.name}</Text>
                    <Text style={styles.cell}>{client?.mutualfund.name}</Text>
                    <Text style={styles.cell}>{client?.amount}</Text>
                    <Text style={styles.cell}>{client?.orderStatus?.name}</Text>
                    <Text style={styles.cell}>
                        {dateTimeFormat(client?.createdAt)}
                    </Text>
                    <Text style={styles.cell}>
                        {dateTimeFormat(client?.startDate)}
                    </Text>
                    <Text style={styles.cell}>{client?.cancelledDate}</Text>
                </View>
            ))}
        </View>
    );
};

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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    headerCell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        padding: 5,
    },
    footerCell: {
        flex: 1,
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

export default MutualSipAccordion;
