import * as React from 'react';
import { StyleSheet, Image, View, Text, ScrollView, Platform, Dimensions, TextInput } from 'react-native';

import { DataTable, Card, Searchbar, Chip, Avatar, Checkbox, Provider, TouchableRipple } from 'react-native-paper';
import DropdownComponent from './DowpDown';
import Button from '../PaperButtons/Button';
import ModalTabs from '../Modal/ModalTabs';
import CustomDataTable from '../Tables/CustomDataTable';
import Icon from 'react-native-vector-icons/FontAwesome';

type mutualfundData = Array<{
  name: string;
  mobile: string;
  email: string;
  pan: string;
  tax_status: string;
}>;


export interface DataTableExampleProps {
  title?: string;
  data: {
    name: string;
    mobile: string;
    email: string;
    pan: string;
    tax_status: string;
  }[];

}

const DataTableExample: React.FC<DataTableExampleProps> = ({ data = [] }) => {
  const [sortAscending, setSortAscending] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(15);
  const [screenDimensions, setScreenDimensions] = React.useState<{ width: number, height: number }>(Dimensions.get('window'));

  // console.log('initial screenDimensions', screenDimensions);

  React.useEffect(() => {
    const updateScreenDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setScreenDimensions({ width, height });
      console.log('screenDimensions', { width, height });
    };
    // 


    // Subscribe to changes in screen dimensions
    Dimensions.addEventListener('change', updateScreenDimensions);

    // Cleanup the event listener when the component unmounts
    // return () => {
    //   // Dimensions.removeAllListeners('change', updateScreenDimensions);
    // };
  }, []);

  const [items] = React.useState<mutualfundData>(data);
  const [search, setSearch] = React.useState<string>("");

  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 200]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    page
  );
  const sortedItems = items
    .slice()
    .sort((item1, item2) =>
      sortAscending
        ? item1.name.localeCompare(item2.name)
        : item2.name.localeCompare(item1.name)
    );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const [isFocused, setIsFocused] = React.useState(false);

  const onChangeSearch = (e) => {
    setSearch(e.value)
  }

  const tableData = [
    {
      name: 'John Doe',
      mobile: '123-456-7890',
      email: 'john@example.com',
      pan: 'ABCDE1234F',
      tax_status: 'Taxable',
    },
    // Add more data objects as needed
  ]
  return (

    <Card className='bg-white p-2' style={{ backgroundColor: "white", borderRadius: 10 }}>
      {/* <View className="m-4 w:full flex lg:flex-row flex justify-between text-white text-sm font-bold rounded-lg"> */}
      <View className="flex sm:flex-row md:flex-col lg:flex-row justify-between w-full my-2">
        <View className='flex flex-row md:w-full lg:w-2/4 ' style={{}}>
          <TextInput
            className='w-10/12 border-t-[0.2px] border-l-[0.2px] border-b-[0.2px] mb-2 rounded-l-lg'
            placeholder={'Search Name/Email/Mobile/ClientID/FE User ID/PAN No'}
            underlineColorAndroid="transparent"
            selectionColor="black"
            placeholderTextColor={"#484848"}
            cursorColor={"transparent"}
            onFocus={() => setIsFocused(true)}
            style={{ padding: 10, fontSize: 10, borderColor: "#484848", color: "#484848", }}
          // {...rest}
          />
          {/* <View style={{ backgroundColor: "#e7e7e7", }}> */}
          <TouchableRipple
            style={{ backgroundColor: "#d7deff", borderColor: "#484848", }}
            onPress={() => console.log('Pressed')}
            rippleColor="rgba(0, 0, 0, .32)"
            className='rounded-r-lg w-2/12 flex flex-column justify-center items-center border-t-[0.2px] border-r-[0.2px] border-b-[0.2px] mb-2'
          >

            <Icon name="search" size={15} color="#000000" />

          </TouchableRipple>
          {/* </View> */}

        </View>

        <View className="flex sm:flex-col md:flex-row lg:items-center md:justify-between lg:justify-end md:w-full lg:w-2/4" style={{}}>
          <View className='mb-2'>
            <DropdownComponent label="KYC" />
          </View>
          <View className='mb-2'>
            <DropdownComponent label="PAN" />
          </View>
          <View className='mb-2'>
            <DropdownComponent label="TAX STATUS" />
          </View>
          <View className='mb-2'>
            <ModalTabs label="ADVANCE FILTER" />
          </View>

        </View>

      </View>
      <CustomDataTable data={tableData} />
    </Card>
  );
};

// DataTableExample.title = 'Data Table';

const styles = StyleSheet.create({
  content: {
    padding: 8,
  },
  first: {
    flex: 2,
  },
});

export default DataTableExample;
