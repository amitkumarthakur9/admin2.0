import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, } from 'react-native';
import { Select, Input } from "native-base";
// import Icon from 'react-native-vector-icons/MaterialIcons'
import DropdownComponent from 'react-native-element-dropdown/lib/typescript/components/Dropdown';
// import DropdownMenu from 'react-native-dropdown-listpicker';
import { Pressable } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownComp from '../components/MultiSelect/component/DropdownComp';
import CalendarPicker from '../components/CustomDatePicker/CalendarPicker';


const FilterComponent = ({ filter, onFilterChange, filterValues, removeFilter }) => {


  let { title, key, fieldType, valueConfig, operator } = filter;
  let initialFilterValue = filterValues.find((f) => f.key === key);

  const removeSingleFilter = () => {
    removeFilter(key)
    initialFilterValue = filterValues.find((f) => f.key === key);
  }

  const handleOperatorChange = (operatorValue) => {

    onFilterChange(key, initialFilterValue?.value, operatorValue);
    initialFilterValue = filterValues.find((f) => f.key === key);
    // console.log('initialFilterValue', initialFilterValue);

  };

  const handleFilterChange = (newValue) => {
    // console.log('value', newValue);

    onFilterChange(key, valueType(newValue), operator);
    // console.log(key, valueType(newValue), operator);

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
      data = filter.apiConfig.defaultData
    }
    switch (fieldType) {

      case 'input':
        return (

          <Input ml="3" value={initialFilterValue?.value || ""} placeholder={title} onChangeText={handleFilterChange} />
        );
      case 'select':


        return (

          <Select
            key={initialFilterValue}
            width={140}
            // p={3}
            className='h-[40px]'
            ml="1"
            accessibilityLabel={title}
            placeholder={title}
            selectedValue={initialFilterValue?.value}
            onValueChange={(newValue) => handleFilterChange(newValue)}
            dropdownIcon={<Icon name="chevron-down" style={{ fontWeight: "100", marginRight: 4 }} color="black" />}
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
        data = filter.apiConfig.defaultData.map((item) => {
          return { value: item[filter.apiConfig.valueField], label: item[filter.apiConfig.displayFields[0]] }
        })
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
          <View className='pl-3 flex flex-row w-full' key={initialFilterValue?.value}>
            <CalendarPicker value={initialFilterValue?.value} handleFilterChange={handleFilterChange} />
            {/* <CalendarPicker /> */}
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
        key={initialFilterValue?.operator}
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
    <View className='flex flex-row items-center'>
      {/* <View className='w-3/12'>
        <Text selectable className=''>{title}</Text>
      </View>
      {fieldType != "date" && <View className='w-4/12'>
        {renderOperatorSelect()}

      </View>
      } */}
      <View>
        {renderFilterInput()}
      </View>

    </View>
  );
};





// Define your filtersSchema and FilterForm components here (similar to the React example)

const ExtraFilters = ({ filtersSchema, onFilterChange, filterValues, removeFilter }) => {
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
              removeFilter={removeFilter}
            />
          }
        </View>
      ))}
    </View>
  );
};

export default ExtraFilters;
