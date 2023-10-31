import * as React from 'react';
import { Image, View, Text, ScrollView, Dimensions, TextInput, } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';

export interface OrderDataTableProps {
  title?: string;
  data: {
    customer_name: string;
    client_code: string;
    scheme_name: string;
    scheme_type: string;
    to_scheme: string;
    order_status: string;
    order_no: string;
    amount: string;
    units: string;
    processing_datetime: string;
  }[];
}

const OrderDataTable: React.FC<OrderDataTableProps> = ({ data = [] }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className='bg-white'>
        <View className='p-2'>
          <View className='flex flex-row items-center mb-5 mt-3'>

            <Link href={"/user/12"} className='mr-4'>
              <Icon name="home" size={18} color="black" />
            </Link>
            <View className='mr-4'>
              <Icon name="angle-right" style={{ fontWeight: "100" }} size={18} color="black" />
            </View>
            <Link className='mr-4' href={"/user/12"} style={{ color: "black", fontSize: 13 }}>
              Home
            </Link>
            <View className='mr-4'>
              <Icon name="angle-right" style={{ fontWeight: "100" }} size={18} color="black" />
            </View>
            <Link href={"/user/12"} style={{ color: "black", fontSize: 13 }}>
              Orders
            </Link>
          </View>

          <View className='flex flex-row justify-between mb-5'>
            <Text className='text-lg'>Client List</Text>
            {/* <Button onPress={() => console.log('click')} style={buttonStyle} labelStyle={labelStyle}>Download Excel</Button> */}

          </View>
          <View className='' style={{}}>
            <TextInput
              className='w-full border-[0.2px]'
              placeholder={'Search Name/Email/Mobile/ClientID/FE User ID/PAN No'}
              underlineColorAndroid="transparent"
              selectionColor="black"
              placeholderTextColor={"#484848"}
              cursorColor={"transparent"}
              onFocus={() => setIsFocused(true)}
              style={{ padding: 10, fontSize: 10, borderColor: "#484848", color: "#484848", height: 40 }}
            />

            <TouchableRipple
              style={{}}
              onPress={() => console.log('Pressed')}
              rippleColor="rgba(0, 0, 0, .32)"
              className='absolute top-0 left-0 right-0'
            >
              <Icon name="filter" size={15} color="#000000" style={{ position: "absolute", right: 12, top: 13 }} />
            </TouchableRipple>
          </View>
        </View>
        <View className='mt-4'>

          {[...Array(8)].map((index, value) => {
            return (


              <View className={`flex flex-row p-2 justify-between flex-wrap ${value % 2 != 0 ? "bg-[#EFEFEF]" : ""}`}>
                <View className='flex sm:flex-col md:flex-col lg:flex-row w-full md:w-8/12 lg:w-7/12'>
                  <View className='flex flex-row md:flex-row lg:flex-row items-center w-full lg:w-5/12 justify-between'>
                    {/* <View className='mr-2'>
                  <Checkbox status='unchecked' />
                </View> */}
                    <View className='flex flex-row items-center justify-start w-10/12 lg:w-full'>
                      <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                        <Text className='text-white'>MN</Text>
                      </View>
                      <View className='flex flex-col'>
                        <Text className='text-black font-semibold max-w-[200px] lg:max-w-[300px] break-all'>KASHINATH NARAYAN MORE{value == 1 && "scadadddaacdacadcdc cddscdscd"}</Text>
                        <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0'>
                          <Text className='text-[#6C6A6A] text-sm'>CCX56Y</Text>
                          <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                          <Text className='text-[#6C6A6A] text-sm'>Order No. 12345</Text>
                        </View>
                      </View>
                    </View>

                    <View className='flex md:flex lg:hidden flex-row items-center justify-center w-2/12 bg-[#D7D7D9] rounded-full'>
                      {/* <View className='flex flex-col px-1 py-1 ml-4 rounded-full'> */}
                      <Text className='p-1 text-black text-end md:text-center text-xs'>Failed</Text>
                      {/* </View> */}
                    </View>
                  </View>

                  <View className='flex md:hidden lg:hidden flex-row items-center justify-between pl-12 mt-1 md:mt-0 lg:mt-0'>
                    <View className='flex flex-row'>
                      <Text className='text-black font-bold text-start md:text-center'>₹5000</Text>
                      <Text className='text-[#6C6A6A] text-xs'>(53 units)</Text>
                    </View>
                    <View className='flex flex-col'>
                      <Text className='text-black text-xs'>24/08/2022 2:30PM</Text>
                    </View>
                  </View>

                  <View className='pl-12 flex flex-row items-center w-full lg:w-7/12 justify-between md:justify-between lg:justify-between mt-2 md:mt-2 lg:mt-0'>
                    <View className='flex flex-col w-5/12 items-start lg:items-center'>
                      <Text className='text-black font-semibold max-w-[200px] break-all text-left'>AXIS MUTUAL FUND</Text>
                      <View className='flex flex-row items-center '>
                        <Text className='text-black text-xs'>Switch Out</Text>
                      </View>
                    </View>
                    <View className='px-1 w-2/12 h-2 items-center'>
                      <Image style={{ flex: 1, height: undefined, width: undefined, resizeMode: "contain" }} className='' source={require('../../../assets/arrow.png')} />
                    </View>
                    <View className='flex flex-col w-5/12 justify-end items-end lg:items-center'>
                      <Text className='text-black font-semibold max-w-[200px] break-all' style={{ textAlign: "right" }}>AXIS MUTUAL FUND</Text>
                      <View className='flex flex-row items-center'>
                        <Text className='text-black text-xs'>Switch In</Text>
                      </View>
                    </View>
                  </View>

                  <View className='flex md:hidden lg:hidden flex-row items-center w-full mt-3'>
                    <TouchableRipple className='w-full py-2 rounded-full border-[0.4px]'>
                      <Text className='text-black text-center md:text-center text-xs'>View Details</Text>
                    </TouchableRipple>
                  </View>
                </View>

                <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-5/12 justify-between'>
                  <View className='flex flex-row items-center sm:w-full md:w-full lg:w-3/12 md:justify-end lg:justify-center'>
                    <View className='flex flex-col'>
                      <Text className='text-black font-semibold'>24/08/2022 2:30PM</Text>
                    </View>
                  </View>
                  <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-7/12  items-center'>
                    <View className='flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center'>
                      <View className='flex flex-col md:flex-row lg:flex-col'>
                        <Text className='text-black font-bold text-start md:text-center'>₹5000</Text>
                        <Text className='text-[#6C6A6A] text-xs'>(53 units)</Text>
                      </View>
                    </View>

                    <View className='hidden md:hidden lg:flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center'>
                      <View className='flex flex-col bg-[#D7D7D7] px-2 py-1 rounded-full'>
                        <Text className='text-black text-start md:text-center text-xs'>Failed</Text>
                      </View>
                    </View>
                  </View>

                  <View className='flex flex-row items-center lg:w-2/12 justify-end md:mt-2 lg:mt-0'>
                    <TouchableRipple className='px-4 md:px-10 lg:px-4 py-1 rounded-full border-[0.4px]'>
                      <Text className='text-black text-start md:text-center text-xs'>View Details</Text>
                    </TouchableRipple>
                  </View>
                </View>
              </View>
            )
          })}

        </View>

      </View>
    </ScrollView>
  );
};


export default OrderDataTable;

