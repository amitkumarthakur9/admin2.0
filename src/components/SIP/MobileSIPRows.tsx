import {
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { OrderInterface } from "../../interfaces/OrderInterface";
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer";
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { Badge, Popover } from "native-base";
import moment from "moment";
import { Link, router } from "expo-router";
import { RupeeSymbol } from "../../helper/helper";

export const MobileSIPRows = ({
    data,
    schema,
}: {
    data: SIPReportItems[];
    schema: any;
}) => {
    const [screenDimensions, setScreenDimensions] = useState<{
        width: number;
        height: number;
    }>(Dimensions.get("window"));
    const detail = (id) => {
        router.replace("/orders/" + id);
    };

    const getInitials = (name: string) => {
        const words = name.split(" ");
        if (words.length >= 2) {
            const firstWord = words[0];
            const secondWord = words[1];
            return `${firstWord[0]}${secondWord[0]}`;
        } else if (words.length === 1) {
            return words[0][0];
        } else {
            return "";
        }
    };

    useEffect(() => {
        const updateScreenDimensions = () => {
            const { width, height } = Dimensions.get("window");
            setScreenDimensions({ width, height });
            // console.log('screenDimensions', { width, height });
        };
        //

        // Subscribe to changes in screen dimensions
        Dimensions.addEventListener("change", updateScreenDimensions);

        // Cleanup the event listener when the component unmounts
        // return () => {
        //   // Dimensions.removeAllListeners('change', updateScreenDimensions);
        // };
    }, []);
    return (
        <>
            {data.map((sip: SIPReportItems, index: number) => {
                return (
                    <View key={index}>
                        <View
                            className={
                                `flex flex-row p-2 justify-between flex-wrap border-slate-400 border-[0.2px] rounded-xl mx-2 mb-3 ` +
                                (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")
                            }
                        >
                            <View className="flex flex-col w-full">
                                <View className="flex flex-row items-center w-full justify-between">
                                    <View className="flex flex-row items-center justify-start w-8/12">
                                        <Pressable
                                            onPress={() =>
                                                router.push(
                                                    `/clients/${sip.account.id}`
                                                )
                                            }
                                            className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center"
                                        >
                                            <Text
                                                selectable
                                                className="text-white"
                                            >
                                                {getInitials(sip.account.name)}
                                            </Text>
                                        </Pressable>
                                        <View className="flex flex-col w-full">
                                            <View className="flex flex-row items-center text-black font-semibold break-all w-9/12">
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all"
                                                >
                                                    {sip.account.name}&nbsp;
                                                </Text>
                                            </View>
                                            <View className="flex flex-row items-center mt-1 md:mt-0 lg:mt-0 flex-wrap w-9/12">
                                                <Text
                                                    selectable
                                                    className="text-[#6C6A6A] text-sm"
                                                >
                                                    {sip.account.clientId}
                                                </Text>
                                                {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                                            <View className='flex flex-row items-center'>
                                                <Text selectable className='text-[#6C6A6A] text-sm'>Folio No. {sip.transactions[0]?.folio?.folioNumber || "-"}&nbsp;</Text>

                                            </View> */}
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex flex-col items-center justify-center w-4/12">
                                        <View className="flex flex-row items-center w-full justify-center">
                                            <Text
                                                selectable
                                                className="p-1 text-black font-bold text-end text-sm"
                                            >
                                                {RupeeSymbol + sip.amount}&nbsp;
                                            </Text>
                                            {sip.units && (
                                                <Text
                                                    selectable
                                                    className="text-[#6C6A6A] text-xs"
                                                >
                                                    ({sip.units} units)
                                                </Text>
                                            )}
                                        </View>
                                        <View className="flex flex-row items-center rounded-full w-full justify-center">
                                            <Text
                                                selectable
                                                className="p-1 text-black text-end text-xs"
                                            >
                                                {sip.orderStatus.name}&nbsp;
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* <View className='flex flex-row items-center justify-between pl-12 mt-1'>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black font-bold text-start'>SIPRegnNo: {sip.sipReferenceNumber}</Text>
                                    {sip.units && <Text selectable className='text-[#6C6A6A] text-xs'>({sip.units} units)</Text>}
                                </View>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black text-xs text-center'>{sip.startDate ? moment(new Date(sip.startDate)).format('DD-MM-YYYY hh:mm:ss A') : ""}</Text>
                                </View>
                            </View> */}

                                <View className="flex flex-row items-center w-full justify-between mt-2">
                                    <View
                                        className={"flex flex-row " + "w-full"}
                                    >
                                        <Image
                                            className="mr-2"
                                            style={{ width: 40, height: 40 }}
                                            source={{
                                                uri: "https://www.fundexpert.in/cdn/logos-neo/icici.png",
                                            }}
                                        />
                                        <View
                                            className={
                                                "flex flex-col justify-end items-start w-8/12"
                                            }
                                        >
                                            <Text
                                                selectable
                                                className="text-black font-semibold break-all text-sm flex-wrap"
                                                style={{ textAlign: "left" }}
                                            >
                                                {sip.mutualfund.name}
                                            </Text>
                                            <View className="flex flex-row items-center flex-wrap">
                                                <Text
                                                    selectable
                                                    className="text-black text-xs"
                                                >
                                                    {
                                                        sip.mutualfund
                                                            ?.mutualfundSubcategory
                                                            ?.name
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex flex-row items-start justify-center w-full flex-wrap mt-3">
                                    <View className="flex flex-col items-center w-4/12 justify-start">
                                        {/* <Text selectable className='text-black font-bold text-[10px] text-center w-10/12'>{(order.orderReferenceNumber.length > 7 ? (order.orderReferenceNumber.slice(0, 7) + "...") : order.orderReferenceNumber) || "-"} </Text> */}
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px] text-center"
                                        >
                                            SIP Reg
                                        </Text>

                                        <Text
                                            selectable
                                            className="text-black font-bold text-[10px] text-center w-10/12"
                                        >
                                            {sip.sipReferenceNumber || "-"}{" "}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-center w-4/12 justify-start">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px] text-center"
                                        >
                                            Folio
                                        </Text>

                                        <Text
                                            selectable
                                            className="text-black font-bold text-[10px] text-center"
                                        >
                                            {sip.transactions[0]?.folio
                                                ?.folioNumber || "-"}{" "}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-center w-4/12 justify-center">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px] text-center"
                                        >
                                            Start Date
                                        </Text>

                                        <Text
                                            selectable
                                            className="text-black font-bold text-[10px] text-center w-10/12"
                                        >
                                            {sip.startDate
                                                ? moment(
                                                      new Date(sip.startDate)
                                                  ).format(
                                                      "DD-MM-YYYY hh:mm:ss A"
                                                  )
                                                : ""}{" "}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex flex-row items-center w-full mt-3">
                                    {/* <TouchableRipple onPress={() => router.push(`orders/${sip.id}`)} className='w-full py-2 rounded-full border-[0.4px]'> */}
                                    <TouchableRipple
                                        rippleColor={"#a2a2a252"}
                                        onPress={() =>
                                            router.push(`sip-reports/${sip.id}`)
                                        }
                                        className="w-full py-2 rounded-full border-[0.4px] bg-black"
                                    >
                                        <Text
                                            selectable
                                            className="text-white text-center text-xs"
                                        >
                                            View Details
                                        </Text>
                                    </TouchableRipple>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            })}
        </>
    );
};
