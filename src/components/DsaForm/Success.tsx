import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import {
  AddIcon,
  CheckCircleIcon,
  HStack,
  Heading,
  Spinner,
  ThreeDotsIcon,
  WarningIcon,
  Modal,
  Image,
} from "native-base";
const CoRoverURL =
    "https://builder.corover.ai/params/?appid=f525521d-c54f-4723-8d41-592f5497b460&partnerKey=c65ed7c2-a07f-4a46-a161-3ed104d7ab57&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5FUCIsImNvbXBhbnlOYW1lIjoiQ29Sb3ZlciIsImVtYWlsSWQiOiJuZXAuc3VwcG9ydEBjb3JvdmVyLmFpIiwiaWF0IjoxNzE1MTcwMDcyLCJleHAiOjE3MTUyNTY0NzJ9.KSBawWk-TC0ykqBMZOY4mIuQjm-xHeSGmkLfnd5cYnE#/";



const Success = ({message="DSA Form Successfully Submitted"}) => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View className="flex flex-row  justify-center pb-4">
                                <Image
                                    className=""
                                    alt="ico"
                                    source={require("../../../assets/images/Tick.png")}
                                    style={{
                                        // flex: 1,
                                        // justifyContent: 'end',
                                        width: 100, // specify the desired width
                                        height: 100,
                                    }}
                                />
                            </View>


                            <View className="flex flex-row justify-center md:pt-8">
                                <Text className="text-center font-semibold color-[#114EA8]">
                                {message}
                                
                                </Text>
                                <Text style={{ color: message.startsWith('Download Success') ? 'green' : 'red', textAlign: 'center' }}>
    {message}
</Text>
                            </View>
    </View>
  );
};

export default Success;
