import * as React from "react";
import { View, Text } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer";
import RemoteApi from "../../services/RemoteApi";

const TableWrapper = ({
    itemsPerPage = 10,
    totalItems,
    data,
    schema,
    apiUrl,
    reqData,
}) => {
    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    // Calculate the number of pages
    const totalPages = Math.ceil((totalItems || data.length) / itemsPerPage);

    const handleNextPage = () => {
        if (currentPageNumber < totalPages) {
            setCurrentPageNumber(currentPageNumber + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPageNumber > 1) {
            setCurrentPageNumber(currentPageNumber - 1);
        }
    };

    const changePage = async (pageNo: number) => {
        reqData["pageNo"] = pageNo;
        await RemoteApi.post("", reqData);
    };

    React.useEffect(() => {
        //page changed
        //API CALL
        // console.log(`page changed to: ${currentPageNumber}`);
    }, [currentPageNumber]);

    return (
        <View className="bg-white">
            <View className="mt-4">
                <DynamicComponentRenderer
                    componentName={schema.component}
                    data={data}
                    schema={schema}
                />
            </View>

            <View className="flex flex-row items-center justify-center my-2">
                <View className="w-6/12 lg:w-4/12 items-center flex flex-row justify-between">
                    <View>
                        <TouchableRipple
                            rippleColor={"transparent"}
                            className="px-3 py-2"
                            onPress={handlePrevPage}
                        >
                            <Icon
                                name="angle-left"
                                size={18}
                                color={
                                    currentPageNumber == 1 ? "#dfdcdc" : "black"
                                }
                            />
                        </TouchableRipple>
                    </View>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <View key={index} className="rounded-md">
                            <TouchableRipple
                                onPress={() => setCurrentPageNumber(index + 1)}
                                className={
                                    "rounded-md px-3 py-2" +
                                    (currentPageNumber == index + 1
                                        ? " bg-black"
                                        : " bg-slate-200")
                                }
                                rippleColor="rgba(0, 0, 0, .32)"
                            >
                                <Text
                                    selectable
                                    className={
                                        currentPageNumber == index + 1
                                            ? "text-white"
                                            : "text-black"
                                    }
                                >
                                    {index + 1}
                                </Text>
                            </TouchableRipple>
                        </View>
                    ))}
                    <View>
                        <TouchableRipple
                            rippleColor={"transparent"}
                            className="px-3 py-2"
                            onPress={handleNextPage}
                        >
                            <Icon
                                name="angle-right"
                                size={18}
                                color={
                                    currentPageNumber == totalPages
                                        ? "#dfdcdc"
                                        : "black"
                                }
                            />
                        </TouchableRipple>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default TableWrapper;
