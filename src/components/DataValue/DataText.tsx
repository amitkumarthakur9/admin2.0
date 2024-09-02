import { Text, View } from "native-base";

const DataText = ({ value }) => {
    return (    
            <Text selectable className="text-[#686868] font-semibold">
                {value ? value : "NA"}
            </Text>
    );
};

export default DataText;
