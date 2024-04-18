import React from "react";
import { Slider, Box, Text, View } from "native-base";
import { TextInput } from "react-native";

const SliderInput = ({
    label,
    value,
    minValue,
    maxValue,
    step,
    onChange,
    suffix = "",
    prefix = "",
}) => {
    const handleTextChange = (text) => {
        if (text && text.length) {
            if (parseFloat(text) > parseFloat(maxValue)) {
                onChange(Math.floor(parseFloat(maxValue)));
            } else {
                onChange(Math.floor(parseFloat(text)));
            }
        } else {
            onChange(Math.floor(0));
        }
    };
    return (
        <Box className="w-full flex flex-col">
            <View className="w-full flex flex-row items-center justify-between">
                <Text color="black.300">{label}</Text>

                <View>
                    <Text
                        color="black"
                        bold
                    >{`${suffix} ${value.toLocaleString()} ${prefix}`}</Text>
                    <TextInput
                        className="outline-none w-full border border-gray-300 p-2 rounded"
                        placeholder="Investment Amount"
                        underlineColorAndroid="transparent"
                        selectionColor="transparent"
                        placeholderTextColor={"rgb(156, 163, 175)"}
                        cursorColor={"transparent"}
                        value={value}
                        onChangeText={handleTextChange}
                    />
                </View>
            </View>
            <View>
                <Slider
                    minValue={minValue}
                    maxValue={maxValue}
                    value={value}
                    step={step}
                    onChange={(v) => onChange(Math.floor(v))}
                    accessibilityLabel={`${label} slider`}
                    colorScheme="darkBlue"
                >
                    <Slider.Track>
                        <Slider.FilledTrack bg="#013974" />
                    </Slider.Track>
                    <Slider.Thumb />
                </Slider>
            </View>
        </Box>
    );
};

export default SliderInput;
