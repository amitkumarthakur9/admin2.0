import { useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import {
  Center,
  HStack,
  Heading,
  Image,
  ScrollView,
  Spinner,
  Text,
} from "native-base";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";

import RemoteApi from "../../../src/services/RemoteApi";
import {
  BorderShadow,
  BorderShadowPhone,
} from "../../../src/components/Styles/Shadow";
import { RupeeSymbol } from "../../../src/helper/helper";
import {
  TransactionDetail,
  TransactionDetailResponseInterface,
} from "../../../src/interfaces/RTADetailInterface";
import DataGrid from "../../../src/components/DataGrid/DataGrid";

export default function RTAConciliationDetail() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<TransactionDetail>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function getOrderDetails() {
      const response: TransactionDetailResponseInterface = await RemoteApi.get(
        `transaction/${id}`
      );
      if (response) {
        setData(response.data);
        setIsLoading(false);
      }
    }
    if (id) {
      getOrderDetails();
    }
  }, [id]);

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

  const gridItems: {
    key: string;
    title: React.JSX.Element | string | null;
    value: React.JSX.Element | string | number | null;
  }[] = [
    {
      key: "rtaAgentCode",
      title: "RTA Agent Code",
      value: data?.mutualfund?.fundhouse?.rta.name,
    },
    {
      key: "bseOrderNumber",
      title: "BSE Order No",
      value: data?.orderReferenceNumber,
    },
    {
      key: "folio",
      title: "Folio No.",
      value: data?.account.id,
    },
    {
      key: "PaymentDate",
      title: "Payment Date",
      value: data?.paymentDate
        ? moment(data?.paymentDate).format("DD-MM-YYYY hh:mm:ss A")
        : "-",
    },
    {
      key: "amount",
      title: "Amount(Stamp Duty + STT + Tax)",
      value: (
        <View>
          <Text>
            {data?.amount
              ? `${RupeeSymbol + data?.amount.toString()} (${
                  data?.stampDuty ? data?.stampDuty : 0
                } + ${data?.tax ? data?.tax : 0} + ${
                  data?.stt ? data?.stt : 0
                })`
              : "-"}
          </Text>
        </View>
      ),
    },
    {
      key: "units",
      title: "Units",
      value: data?.units,
    },
    {
      key: "nav",
      title: "NAV",
      value: data?.nav,
    },
    {
      key: "allotedAmount",
      title: "Alloted Amount",
      value: data?.allotedAmount ? data?.allotedAmount : "-",
    },
    {
      key: "transactionAStatus",
      title: "Transaction Status",
      value: data?.transactionStatus ? data?.transactionStatus?.name : "-",
    },
    {
      key: "transactionType",
      title: "Transaction Type",
      value: data?.transactionType ? data?.transactionType?.name : "-",
    },
    {
      key: "settlementDate",
      title: "Settlement Date",
      value: data?.settlementDate
        ? moment(data.settlementDate).format("DD-MM-YYYY hh:mm:ss A")
        : "-",
    },
  ];

  return (
    <>
      {isLoading ? (
        <Center>
          <HStack
            space={2}
            marginTop={20}
            marginBottom={20}
            justifyContent="center"
          >
            <Spinner color={"black"} accessibilityLabel="Loading order" />
            <Heading color="black" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Center>
      ) : (
        <ScrollView className={`bg-white`} showsVerticalScrollIndicator={true}>
          <View className="bg-white">
            <View className="">
              <View className="flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 ">
                <View className="flex flex-col w-6/12">
                  <Text selectable className="text-2xl font-extrabold mb-3">
                    Transaction #{id}
                  </Text>
                  <View className="flex flex-row items-center">
                    <Link href={"../"} className="mr-4">
                      <Text>Dashboard</Text>
                    </Link>
                    <View className="mr-4">
                      <Icon
                        name="circle"
                        style={{ fontWeight: "100" }}
                        size={8}
                        color="grey"
                      />
                    </View>
                    <Link href={"/rta-reconciliation"} className="mr-4">
                      <Text>Transactions</Text>
                    </Link>
                  </View>
                </View>
                <View className="w-6/12 overflow-hidden h-full flex flex-row justify-center">
                  <ImageBackground
                    className=""
                    source={require("../../../assets/images/ChatBc.png")}
                    resizeMode="center"
                  ></ImageBackground>
                </View>
              </View>
            </View>
            <View>
              <View className="flex flex-row justify-between mx-5">
                <View></View>
              </View>
              <View
                className="flex flex-row p-2 mx-2 items-center rounded"
                style={Platform.OS == "web" ? BorderShadow : BorderShadowPhone}
              >
                <View className="flex flex-row items-center p-2">
                  <View className="flex flex-col ">
                    <View className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center">
                      <Text selectable className="text-white text-center">
                        {getInitials(data.account.name)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-col ml-1">
                    <Text selectable className="font-bold text-base">
                      {data.account.name}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text selectable className=" text-xs">
                        {data.account.clientId}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                className="flex flex-col my-4 mx-2 items-center justify-between rounded"
                style={Platform.OS == "web" ? BorderShadow : BorderShadowPhone}
              >
                <View className="flex flex-col w-full p-2">
                  <View className="flex flex-row items-center w-full flex-wrap ">
                    <View
                      className={
                        "flex flex-row items-center justify-start w-8/12"
                      }
                    >
                      <Image
                        alt="fundHouse"
                        className="mr-2"
                        style={{ width: 40, height: 40, objectFit: "contain" }}
                        source={{ uri: data.mutualfund.fundhouse.logoUrl }}
                      />
                      <View className={"flex flex-col justify-end items-start"}>
                        <Text
                          selectable
                          className="text-black font-semibold break-all text-sm flex-wrap"
                        >
                          {data.mutualfund.name}
                        </Text>

                        <View className="flex flex-row items-center flex-wrap">
                          <Text selectable className=" text-blacktext-xs">
                            {data.mutualfund.fundhouse.name}
                          </Text>
                          <View className="mx-2">
                            <Icon
                              name="circle"
                              style={{ fontWeight: "100" }}
                              size={8}
                              color="grey"
                            />
                          </View>
                          <Text selectable className="text-black text-xs">
                            {data.mutualfund.bseDematSchemeCode}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className="flex flex-row items-center w-full flex-wrap mt-4 p-3">
                    {gridItems.map((item) => {
                      return (
                        <DataGrid
                          key={item.key}
                          title={item.title}
                          value={item.value}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}
