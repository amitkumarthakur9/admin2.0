import { ImageBackground, View, useWindowDimensions } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import {
  Avatar,
  Button,
  Center,
  HStack,
  Heading,
  Image,
  ScrollView,
  Spinner,
  Text,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import RemoteApi from "../../../src/services/RemoteApi";
import {
  BorderShadow,
  BorderShadowPhone,
  HeaderShadow,
} from "../../../src/components/Styles/Shadow";
import { RupeeSymbol } from "../../../src/helper/helper";
import { Platform } from "react-native";
import {
  TransactionDetail,
  TransactionDetailResponseInterface,
} from "../../../src/interfaces/RTADetailInterface";
import moment from "moment";

const DataGrid = ({ title, value }) => {
  return (
    <View
      className={
        "flex flex-row items-center w-4/12 lg:w-3/12 justify-center lg:justify-start mb-[30px]"
      }
    >
      <View className="flex flex-col">
        <Text selectable className="font-medium">
          {value ? value : "-"}
        </Text>
        <Text className="text-[10px] text-slate-500" selectable>
          {title ? title : "-"}
        </Text>
      </View>
    </View>
  );
};

export default function RTAConciliationDetail() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<TransactionDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const { height, width } = useWindowDimensions();

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

  const getColorCode = (status: string) => {
    let color = "#ece09d";
    if (status == "Cancelled" || status == "Failed") {
      color = "#ffd5d5";
    } else if (status == "Success") {
      color = "#afc9a2";
    }

    return color;
  };

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
                      {/* <Icon name="home" size={18} color="black" /> */}
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
                      {/* <Icon name="home" size={18} color="black" /> */}
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
                    <DataGrid
                      key="rtaAgentCode"
                      title="RTA Agent Code"
                      value={data.mutualfund.fundhouse.rta.name}
                    />
                    <DataGrid
                      key="bseOrderNumber"
                      title="BSE Order No."
                      value={data.orderReferenceNumber}
                    />
                    <DataGrid
                      key="paymentDate"
                      title="Payment Date"
                      value={
                        data.paymentDate
                          ? moment(data.paymentDate).format(
                              "DD-MM-YYYY hh:mm:ss A"
                            )
                          : "-"
                      }
                    />
                    <DataGrid
                      key="folioNumber"
                      title="Folio No."
                      value={data.account.id}
                    />
                    <DataGrid key="units" title="Units" value={data.units} />
                    <DataGrid key="nav" title="NAV" value={data.nav} />
                    <DataGrid
                      key="amount"
                      title="Amount"
                      value={
                        data.amount ? RupeeSymbol + data.amount.toString() : "-"
                      }
                    />
                    <DataGrid
                      key="settlementDate"
                      title="Settlement Date"
                      value={
                        data.settlementDate
                          ? moment(data.settlementDate).format(
                              "DD-MM-YYYY hh:mm:ss A"
                            )
                          : "-"
                      }
                    />
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
