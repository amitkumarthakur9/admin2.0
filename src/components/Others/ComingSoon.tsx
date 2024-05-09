import React from 'react';
import { View, Image, Text } from 'react-native';

const ComingSoon = () => {
  return (
    <View className="flex flex-col h-auto justify-center items-center pt-4">
    <Image
        className=""
        alt="ico"
        source={require("../../../assets/images/comingsoon.png")}
        style={{
            // flex: 1,
            // justifyContent: 'end',
            // width: 100, // specify the desired width
            // height: 100,
        }}
    />
    <Text className="py-4 text-lg font-bold text-center">
        Coming Soon
    </Text>
</View>
    
  );
};

export default ComingSoon;
