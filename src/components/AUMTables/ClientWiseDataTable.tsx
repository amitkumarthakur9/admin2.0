import * as React from "react";
import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { CheckCircleIcon, WarningIcon } from "native-base";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import Tag from "../Tag/Tag";
import { useUserRole } from "../../context/useRoleContext";
import DataTableComponent from "../ReportTables/ReportDataTable";

const ClientWiseDataTable = () => {
    const headers = [
        "Client Name",
        "Client Code",
        "PAN",
        "Total Invested",
        "Current Value",
        "XIRR",
        "Returns",
        // "",
    ];

    const cellSize = [3, 1, 1, 1, 1, 1, 1];

    const { roleId } = useUserRole();

    const transformData = (data) => {
        console.log("transformData", data);
        return data?.map((item) => {
            const itemStructure = [
                {
                    key: "clientName",
                    content: (
                        <View className="flex flex-row items-center justify-center w-[99%]">
                            <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                                <Text selectable className="text-white">
                                    {getInitials(item?.name)}
                                </Text>
                            </View>
                            <View className="flex flex-col  w-9/12">
                                <View className="flex flex-row items-center text-black font-semibold mb-2">
                                    <Pressable
                                        onPress={() =>
                                            router.push(`clients/${item?.id}`)
                                        }
                                        className="flex flex-row w-[99%]"
                                    >
                                        <Text
                                            selectable
                                            className="flex flex-row text-black font-semibold break-all"
                                        >
                                            {item?.name}&nbsp;{" "}
                                        </Text>

                                        <View className="flex flex-row items-center">
                                            {item?.isActive == true ? (
                                                <CheckCircleIcon
                                                    color="emerald.500"
                                                    size="xs"
                                                />
                                            ) : (
                                                <WarningIcon
                                                    size="xs"
                                                    color="orange.500"
                                                />
                                            )}
                                        </View>
                                    </Pressable>
                                </View>
                                <View className="flex flex-row items-center mt-0">
                                    {item?.kycStatus?.name == "Verified" ? (
                                        <Tag>KYC Done</Tag>
                                    ) : (
                                        <Tag>KYC Not Done</Tag>
                                    )}
                                    {/* <Tag>SIP(N/A)</Tag> */}
                                    {/* <Tag>Autopay active</Tag> */}
                                </View>
                            </View>
                        </View>
                    ),
                },
                {
                    key: "clientCode",
                    content: (
                        <Text
                            selectable
                            className="text-[#686868] font-semibold w-11/12"
                        >
                            {item?.clientId ? item?.clientId : "-"}
                        </Text>
                    ),
                },
                {
                    key: "panNumber",
                    content: (
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.panNumber ? item?.panNumber : "-"}
                        </Text>
                    ),
                },
                {
                    key: "totalinvested",
                    content: (
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.investedValue
                                ? RupeeSymbol + item?.investedValue.toFixed(2)
                                : RupeeSymbol + "0"}
                        </Text>
                    ),
                },
                {
                    key: "CurrentValue",
                    content: (
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.currentValue
                                ? RupeeSymbol + item?.currentValue.toFixed(2)
                                : RupeeSymbol + "0"}
                        </Text>
                    ),
                },
                {
                    key: "XIRR",
                    content: (
                        <View className="w-[99%]">
                            <Text
                                selectable
                                className="text-[#686868] font-semibold"
                            >
                                {item?.xirr
                                    ? item?.xirr.toFixed(2) + "%"
                                    : "0%"}
                            </Text>
                        </View>
                    ),
                },
                {
                    key: "returns",
                    content: (
                        <View className="flex flex-row justify-center text-[#686868] font-semibold w-11/12 ">
                            <Text
                                selectable
                                className="text-[#686868] font-semibold w-11/12"
                            >
                                {item?.investedValue && item?.currentValue
                                    ? RupeeSymbol +
                                      (
                                          item?.currentValue -
                                          item?.investedValue
                                      ).toFixed(2)
                                    : RupeeSymbol + "0"}
                            </Text>
                        </View>
                    ),
                },
            ];

            // Conditionally add an additional object based on roleId to index 2
            if (roleId > 2) {
                itemStructure.splice(2, 0, {
                    key: "distributor",
                    content: (
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.distributor?.name}
                        </Text>
                    ),
                });
            }

            if (roleId > 3) {
                itemStructure.splice(3, 0, {
                    key: "Manager",
                    content: (
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.distributor?.managementUsers?.[0].name}
                        </Text>
                    ),
                });
            }

            return itemStructure;
        });
    };

    const mobileDataStructure = (data) =>
        data.map((item) => ({
            CurrentValue: "RupeeSymbol + item.currentValue",
            InvestedValue: "RupeeSymbol + item.investedValue",
            XIRR: "item.xirr",
        }));

    return (
        
        <DataTableComponent
            headers={headers}
            transformData={transformData}
            endpoint="aum/client/list"
            filtersSchemaEndpoint="aum/client/schema"
            mobileDataStructure={mobileDataStructure}
            roleId={useUserRole().roleId}
            tableId="ClientWiseAUM" // Unique table ID
            cellSize={cellSize}
        />
    );
};

export default ClientWiseDataTable;
