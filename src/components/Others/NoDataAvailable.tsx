import React from 'react';
import { View, Image, Text } from 'react-native';

const NoDataAvailable = () => {
  return (
    <View className='h-[500px] z-[-4]'>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        // style={{ width: 100, height: 100 }} // adjust width and height as needed
        source={require("../../../assets/images/noDataAvailable.png")}
        alt="No Data Available"
      />
      <Text style={{ paddingTop: 10, fontSize: 16, fontWeight: 'bold' }}>No Data Available</Text>
    </View>

    </View>
    
  );
};

export default NoDataAvailable;
