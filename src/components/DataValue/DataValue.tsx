import { Text, View } from "native-base";

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-col md:flex-row justify-between items-start p-2">
            <View className="w-full md:w-1/2 flex">
                <Text className="text-bold font-medium  text-gray-500" selectable>
                    {title ? title : "-"}
                </Text>
            </View>
            <View className="w-full md:w-1/2 flex">
                <Text
                    selectable
                    className="font-medium text-start text-black"
                >
                    {value ? value : "NA"}
                </Text>
            </View>
        </View>
    );
};

export default DataValue;
