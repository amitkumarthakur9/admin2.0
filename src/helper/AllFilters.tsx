import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, } from 'react-native';
import { Select, Input } from "native-base";
import DatePickerComponent from '../components/CustomDatePicker/DatePicker';
// import Icon from 'react-native-vector-icons/MaterialIcons'
import DropdownComponent from 'react-native-element-dropdown/lib/typescript/components/Dropdown';
// import DropdownMenu from 'react-native-dropdown-listpicker';
import { Pressable } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownComp from '../components/MultiSelect/component/DropdownComp';


const FilterComponent = ({ filter, onFilterChange, filterValues }) => {
  const { title, key, fieldType, valueConfig, operator } = filter;

  let initialFilterValue = filterValues.find((f) => f.key === key);


  const handleOperatorChange = (operatorValue) => {

    onFilterChange(key, initialFilterValue?.value, operatorValue);
    initialFilterValue = filterValues.find((f) => f.key === key);
  };

  const handleFilterChange = (newValue) => {
    // console.log('value', newValue);

    onFilterChange(key, valueType(newValue), valueConfig.valueType == "date" ? "between" : initialFilterValue?.operator);
    initialFilterValue = filterValues.find((f) => f.key === key);
    // console.log(initialFilterValue);

  };


  const valueType = (newValue) => {
    // console.log('newValue', newValue);

    switch (valueConfig.valueType) {
      case 'string':
        return (newValue + "");
      case 'number':
        return typeof newValue === 'string' ? Number(newValue) : newValue;
      case 'number[]':
        if (!Array.isArray(newValue)) {
          newValue = [newValue]
        } else {
          let newArr = []
          newValue.forEach((val) => {
            newArr.push(Number(val))
          })
          newValue = newArr
        }
        return newValue;
      default:
        return newValue
    }
  }

  const renderFilterInput = () => {
    const apiCallRequired = filter.apiConfig && filter.apiConfig.defaultData ? false : true
    let data = []
    if (apiCallRequired) {
      //  data = []
    } else {
      // data = filter.apiConfig.defaultData.map((item) => {
      //   return { id: item.id, label: item.name }
      // })
      data = filter.apiConfig.defaultData.map((item) => {
        return { value: item.id, label: item.name }
      })
    }
    switch (fieldType) {

      case 'input':
        return (

          <Input ml="3" value={initialFilterValue?.value || ""} placeholder={title} onChangeText={handleFilterChange} />
        );
      case 'select':


        return (

          <Select
            ml="3"
            accessibilityLabel={title}
            placeholder='Select'
            selectedValue={initialFilterValue?.value}
            onValueChange={(newValue) => handleFilterChange(newValue)}
          >
            {data.map((op) => (
              <Select.Item key={op[filter.apiConfig.valueField]} label={op[filter.apiConfig.displayFields[0]]} value={op[filter.apiConfig.valueField]} />
            ))}
          </Select>
        );
      case 'checkbox':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{title}</Text>
            <Switch
              value={initialFilterValue?.value}
              onValueChange={(newValue) => handleFilterChange(newValue)}
            />
          </View>
        );
      case 'multiSelect':

        return (
          <View style={{}} className='ml-3'>
            <DropdownComp
              selectedItems={initialFilterValue?.value}
              showMultipleAsBadge={true}
              listItemLeftIconComp={<View></View>}
              selectedItemBadgeCloseIconStyle={{ color: "black", fontSize: 10 }}
              data={data}
              badgeBackgroundColor={["#ffffff"]}
              onSelected={handleFilterChange}
              radius={0}
              borderless={true}
              scrollable={true}
              selectedtextStyle={{ fontSize: 14, color: "black", marginLeft: 4 }}
              ListItemStyle={{ padding: 0, }}
              DropDownContainerStyle={{ padding: 0, backgroundColor: "white", }}
              ListStyle={{ backgroundColor: "white" }}
              selectedItemBadgeLabelStyle={{ fontSize: 12, color: "black" }}
              selectedItemBadgeStyle={{ alignItems: "center", }}
              ListLabelStyle={{ fontSize: 10, padding: 0, color: "black" }}
              markedIconStyle={{ color: "black" }}
              dropdownIndicator='arrow'
              placeholder='select'
              mode='UNDERLAY'
            />
          </View>
        );
      case 'number':
        return (
          <Input ml="3" value={initialFilterValue?.value || ""} placeholder={title} onChangeText={handleFilterChange} />

        );
      case 'date':
        return (
          <View className='ml-3' key={key}>
            <DatePickerComponent value={initialFilterValue?.value} handleFilterChange={handleFilterChange} />
          </View>
        );
      // Add cases for other field types as needed
      default:
        return <View></View>;
    }
  };

  const renderOperatorSelect = () => {
    return <View className=''>
      <Select
        dropdownIcon={<Icon style={{ marginRight: 4 }} name="angle-down" size={18} />}
        ml="3"
        accessibilityLabel="Operator"
        placeholder='Operator'
        selectedValue={initialFilterValue?.operator}
        onValueChange={(newValue) => handleOperatorChange(newValue)}
      >
        {operator.map((op) => (
          <Select.Item key={op.subKey} label={op.name} value={op.subKey} />
        ))}
      </Select>
    </View>;
  };



  return (
    <View className='flex flex-row items-center mb-2 justify-between'>
      <View className='w-3/12'>
        <Text className=''>{title}</Text>
      </View>
      {fieldType != "date" && <View className='w-4/12'>
        {renderOperatorSelect()}

      </View>
      }
      <View className={fieldType != "date" ? 'w-5/12' : 'w-9/12'}>
        {renderFilterInput()}
      </View>
    </View>
  );
};





// Define your filtersSchema and FilterForm components here (similar to the React example)

const FilterForm = ({ filtersSchema, onFilterChange, filterValues }) => {
  return (
    <View>
      {filtersSchema.map((filter, key) => (
        <View key={key}>
          {
            filter.key !== "all" && <FilterComponent
              key={filter.key}
              filter={filter}
              onFilterChange={onFilterChange}
              filterValues={filterValues}
            />
          }
        </View>
      ))}
    </View>
  );
};

export default FilterForm;
