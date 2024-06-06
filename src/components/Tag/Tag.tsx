import { Text, View } from "native-base";

const Tag = ({ children, className }: { children: any; className?: any }) => {
    return (
        <View
            className={`rounded-full bg-gray-200 px-2 py-1 mr-2 mb-1 ${className}`}
        >
            <Text className="text-black font-semibold text-xs">{children}</Text>
        </View>
    );
};

export default Tag;
