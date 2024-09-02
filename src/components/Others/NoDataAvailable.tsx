import React from 'react';
import { View, Image, Text } from 'react-native';

const NoDataAvailable = ({message="", height="500px"}) => {

  const customeStyle = `h-[${height}] z-[-4]`;
  
  return (
    <View className={customeStyle} >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        // style={{ width: 100, height: 100 }} // adjust width and height as needed
        source={require("../../../assets/images/noDataAvailable.png")}
        alt="No Data Available"
      />
      <Text style={{ paddingTop: 10, fontSize: 16, fontWeight: 'bold' }}>No Data Available</Text>
      <Text style={{ paddingTop: 10, fontSize: 14, fontWeight: 'bold' }}>{message}</Text>
    </View>

    </View>
    
  );
};

export default NoDataAvailable;
