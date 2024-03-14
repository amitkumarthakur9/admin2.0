import React from "react";
import { Radio, Text, View } from "native-base";

const RadioButton = ({ name, value, setValue, options }) => {
    return (
        <View className="w-full">
            <Radio.Group
                name={name}
                value={value}
                onChange={(nextValue) => {
                    setValue(nextValue);
                }}
                color={"#013974"}
                className="w-full flex flex-row items-center justify-between"
                aria-label="radio"
            >
                {options?.map((option) => {
                    return (
                        <Radio
                            key={option.value}
                            value={option.value}
                            my="2"
                            color={"#013974"}
                        >
                            <Text selectable className="text-xs w-full">
                                {option.label}
                            </Text>
                        </Radio>
                    );
                })}
            </Radio.Group>
        </View>
    );
};

export default RadioButton;
