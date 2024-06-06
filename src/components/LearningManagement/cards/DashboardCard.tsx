import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DashboardCard = ({ icon, count, label }) => {
    return (
        <View
            className="md:w-[25%] border-[#dbdbdb] border-[0.1px] rounded-[40px] bg-white mr-[20px] px-[20px] py-[20px]"
            style={{
                borderColor: "#e4e4e4",
                borderRightWidth: StyleSheet.hairlineWidth,
            }}
        >
            <View className="flex flex-col items-center">
                <View className="p-5 bg-[#eaf3fe] rounded-full">{icon}</View>
                <View className="flex flex-row justify-center mt-3">
                    <Text
                        selectable
                        className="text-black font-bold text-[30px]"
                    >
                        {count}
                    </Text>
                </View>
                <View className="flex flex-row justify-center mt-1">
                    <Text selectable className="text-[#6e6e6e] text-sm">
                        {label}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default DashboardCard;
