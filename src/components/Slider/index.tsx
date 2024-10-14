// import React from "react";
// import { Slider, Box, Text, View } from "native-base";
// import { TextInput } from "react-native";

// const SliderInput = ({
//     label,
//     value,
//     minValue,
//     maxValue,
//     step,
//     onChange,
//     suffix = "",
//     prefix = "",
// }) => {
//     const handleTextChange = (text) => {
//         if (text && text.length) {
//             if (parseFloat(text) > parseFloat(maxValue)) {
//                 onChange(Math.floor(parseFloat(maxValue)));
//             } else {
//                 onChange(Math.floor(parseFloat(text)));
//             }
//         } else {
//             onChange(Math.floor(0));
//         }
//     };
//     return (
//         <Box className="w-full flex flex-col">
//             <View className="w-full flex flex-row items-center justify-between">
//                 <Text color="black.300">{label}</Text>

//                 <View>
//                     <Text
//                         color="black"
//                         bold
//                     >{`${suffix} ${value.toLocaleString()} ${prefix}`}</Text>
//                     <TextInput
//                         className="outline-none w-full border border-gray-300 p-2 rounded"
//                         placeholder="Investment Amount"
//                         underlineColorAndroid="transparent"
//                         selectionColor="transparent"
//                         placeholderTextColor={"rgb(156, 163, 175)"}
//                         cursorColor={"transparent"}
//                         value={value}
//                         onChangeText={handleTextChange}
//                     />
//                 </View>
//             </View>
//             <View>
//                 <Slider
//                     minValue={minValue}
//                     maxValue={maxValue}
//                     value={value}
//                     step={step}
//                     onChange={(v) => onChange(Math.floor(v))}
//                     accessibilityLabel={`${label} slider`}
//                     colorScheme="darkBlue"
//                 >
//                     <Slider.Track>
//                         <Slider.FilledTrack bg="#013974" />
//                     </Slider.Track>
//                     <Slider.Thumb />
//                 </Slider>
//             </View>
//         </Box>
//     );
// };

// export default SliderInput;


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
    // Function to handle the input text change
    const handleTextChange = (text) => {
        if (text && text.length) {
            const inputValue = parseFloat(text);

            if (inputValue > parseFloat(maxValue)) {
                onChange(parseFloat(maxValue));
            } else if (isNaN(inputValue)) {
                onChange(0);
            } else {
                // Check if step contains a decimal, and allow decimals if true
                if (step % 1 !== 0) {
                    onChange(inputValue); // Allow decimals
                } else {
                    onChange(Math.floor(inputValue)); // Force whole number for whole number steps
                }
            }
        } else {
            onChange(0);
        }
    };

    // Format value based on whether step contains decimal or not
    const formatValue = (value) => {
        return step % 1 !== 0 ? value.toFixed(1) : value.toString();
    };

    return (
        <Box className="w-full flex flex-col">
            <View className="w-full flex flex-row items-center justify-between">
                <Text color="black.300">{label}</Text>

                <View>
                    <Text
                        color="black"
                        bold
                    >{`${suffix} ${formatValue(value)} ${prefix}`}</Text>
                    <TextInput
                        className="outline-none w-full border border-gray-300 p-2 rounded"
                        placeholder="Enter Value"
                        underlineColorAndroid="transparent"
                        selectionColor="transparent"
                        placeholderTextColor={"rgb(156, 163, 175)"}
                        cursorColor={"transparent"}
                        value={formatValue(value)} // Format the value for display
                        keyboardType="numeric" // Numeric keyboard for input
                        onChangeText={handleTextChange} // Handle text changes
                    />
                </View>
            </View>
            <View>
                <Slider
                    minValue={minValue}
                    maxValue={maxValue}
                    value={value}
                    step={step}
                    onChange={(v) => onChange(step % 1 !== 0 ? v : Math.floor(v))} // If step has decimals, allow decimals
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
