import { View } from "react-native";
import { Checkbox } from "react-native-paper";

export default function CustomCheckBox({ isChecked, setIsChecked }: { isChecked: boolean, setIsChecked: any }) {
    return <View className="mt-4">
        <Checkbox
            status={isChecked ? 'checked' : 'unchecked'}
            onPress={() => {
                setIsChecked(!isChecked);
            }}
        />
    </View>
}