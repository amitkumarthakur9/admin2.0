import { View } from "react-native";
import { Text } from "native-base";
import { ReactElement } from "react";

interface IDataGrid {
    key: string;
    title: React.JSX.Element | string | null;
    value: React.JSX.Element | string | number | null;
}

const DataGrid = ({ title, value }: IDataGrid) => {
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

export default DataGrid;
