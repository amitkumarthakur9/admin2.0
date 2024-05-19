import { View } from "react-native";
import { Text } from "native-base";
import { ReactElement } from "react";

interface IDataGrid {
    key: string;
    title: React.JSX.Element | string | null;
    value: React.JSX.Element | string | number | null;
    reverse?: boolean;
}

const DataGrid = ({ title, value, reverse }: IDataGrid) => {
    return (
        <View
            className={
                "flex flex-row items-center w-1/2 md:w-4/12 lg:w-3/12 justify-start md:justify-center lg:justify-start mb-[30px]"
            }
        >
            <View className={`flex flex-col${reverse && "-reverse"} w-[99%]`}>
                <Text selectable className="text-base font-medium">
                    {value ? value : "-"}
                </Text>
                <Text className="text-sm text-slate-500" selectable>
                    {title ? title : "-"}
                </Text>
            </View>
        </View>
    );
};

export default DataGrid;
