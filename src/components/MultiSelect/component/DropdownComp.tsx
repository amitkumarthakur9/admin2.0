import React, { useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  DPMProps,
  ItemProps,
  ListItemProps,
} from 'react-native-dropdown-listpicker';
import { DOWN_ARROW, PLACEHOLDER, PLUS } from '../constants';
import { MainList, styles, SubList1 } from '../styles';
import { SearchBar } from './SearchBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ZStack, Box, Menu } from "native-base";


export default function DropdownComp({
  badgeBackgroundColor,
  borderless,
  DropDownContainerStyle,
  placeholder,
  data,
  selectedItems = [],
  onSelected,
  radius,
  showMultipleAsBadge,
  DropdownListStyle,
  ListLabelStyle,
  markedIconStyle,
  selectedItemBadgeStyle,
  selectedItemBadgeLabelStyle,
  selectedItemBadgeCloseIconStyle,
  selectedtextStyle,
  mode,
  HideSelectionTextStyle,
  ListStyle,
  scrollable,
  listItemLeftIconComp,
  ListItemSelectedIconComp,
  sublistItemLeftIconComp,
  dropdownIndicator,
  searchable,
}: DPMProps) {
  const [filteredData, setfilteredData] = useState<ItemProps[]>();
  const itemsRef = useRef<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openSelction, setOpenSelction] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [value] = useState<string>(PLACEHOLDER);
  if (!selectedItems) {
    selectedItems = []
  }

  const sData = data.filter((item: any) => selectedItems?.includes(item.value)).map((item: any) => item?.label)

  const flatListDefStyle = {
    ...DropdownListStyle,
    opacity: open ? 1 : 0,
  };
  function ListItemSelectedIcon() {
    switch (typeof ListItemSelectedIconComp) {
      case 'object':
        return ListItemSelectedIconComp;
      default:
        return <Text style={[{ ...styles.ITCMark, ...markedIconStyle }]}>✓</Text>;
    }
  }
  function checkifInArray(label: string) {
    console.log('for cancel', label);

    if (selectedItems?.includes(label)) {
      let index = selectedItems.indexOf(label);
      selectedItems.splice(index, 1);
      onSelected(selectedItems);
      setRefresh(!refresh);
    } else {
      selectedItems?.push(label);
      onSelected(selectedItems);
      setRefresh(!refresh);
    }
  }
  function handleListItemClick(label: any) {
    console.log('djbcsdcsd', label);

    checkifInArray(label);
    setOpenSelction(!showMultipleAsBadge ? true : false);
  }

  function ItemComponentContent({ label, style, level, value }: ListItemProps) {
    switch (level) {
      case 'sub':
        return (
          <TouchableOpacity
            key={label + new Date().getSeconds().toString()}
            style={style}
            onPress={() => handleListItemClick(value)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {sublistItemLeftIconComp ? sublistItemLeftIconComp : null}
              <Text style={[{ ...styles.ITCLabel, ...ListLabelStyle }]}>
                {label}
              </Text>
            </View>
            {sData.includes(label) ? <ListItemSelectedIcon /> : null}
          </TouchableOpacity>
        );

      default:
        return (
          <TouchableOpacity
            key={label + new Date().getSeconds().toString()}
            style={style}
            onPress={() => handleListItemClick(value)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {listItemLeftIconComp ? listItemLeftIconComp : null}
              <Text style={[{ ...styles.ITCLabel, ...ListLabelStyle }]}>
                {label}
              </Text>
            </View>
            {sData.includes(label) ? <ListItemSelectedIcon /> : null}
          </TouchableOpacity>
        );
    }
  }
  function ItemComponent({ label, value, root }: ListItemProps) {
    return (
      <View>
        <ItemComponentContent label={label} value={value} style={MainList} />
        {typeof value === 'object'
          ? value.map(_ => (
            <ItemComponentContent
              key={value.toString() + new Date().getSeconds().toString()}
              root={root}
              label={_.label}
              value={_.value}
              style={SubList1}
              level="sub"
            />
          ))
          : null}
      </View>
    );
  }
  function hideSelection() {
    setOpenSelction(false);
  }
  function RenderSeletedItem() {
    switch (showMultipleAsBadge) {
      case true:
        return (
          <ScrollView
            style={styles.RSIBScrollView}
            horizontal
            scrollEnabled={scrollable}
            showsHorizontalScrollIndicator={false}>
            {sData.map((_, index) => {
              let fData: any = data.find(item => item.label == _)
              return fData && <TouchableOpacity
                key={_.toString() + new Date().getSeconds().toString()}
                onPress={() => checkifInArray(fData?.value)}>
                <View
                  style={[
                    { ...styles.RSIBTO, ...selectedItemBadgeStyle },
                    // {
                    //   backgroundColor:
                    //     badgeBackgroundColor[
                    //     Math.floor(
                    //       Math.random() * badgeBackgroundColor.length,
                    //     )
                    //     ],
                    // },
                  ]}>
                  {/* <Text style={styles.RSIBDot}>{'\u2B24'}</Text> */}
                  <Text
                    style={[
                      { ...styles.RSIBLabel, ...selectedItemBadgeLabelStyle },
                    ]}>
                    {fData.label}
                  </Text>
                  <Text
                    style={[
                      {
                        ...styles.RSIBDelete,
                        ...selectedItemBadgeCloseIconStyle,
                      },
                    ]}>
                    {' '}
                    X{' '}
                  </Text>
                </View>
              </TouchableOpacity>
            })
            }
          </ScrollView>
        );
      case false:
        return (
          <Text
            style={[
              { ...styles.RSIBOnlyTextExt, ...selectedtextStyle },
            ]}>{`${sData.length} item(s) selected`}</Text>
        );
      default:
        return null;
    }
  }
  function RenderBadgeBelow() {
    return (
      <View>
        <ScrollView
          style={{
            opacity: sData.length == 0 || !openSelction ? 0 : 1,
            height: !openSelction ? 0 : undefined,
          }}>
          <View style={[{ ...styles.DDPBadgeBelowPicker, ...ListStyle }]}>
            {sData.map(_ => (
              <TouchableOpacity
                key={_.toString() + new Date().getSeconds().toString()}
                onPress={() => checkifInArray(_)}>
                <View
                  style={[
                    { ...styles.RSIBTO, ...selectedItemBadgeStyle },
                    {
                      backgroundColor:
                        badgeBackgroundColor[
                        Math.floor(
                          Math.random() * badgeBackgroundColor.length,
                        )
                        ],
                    },
                  ]}>
                  <Text style={styles.RSIBDot}>{'\u2B24'}</Text>
                  <Text
                    style={[
                      { ...styles.RSIBLabel, ...selectedItemBadgeLabelStyle },
                    ]}>
                    {_}
                  </Text>
                  <Text
                    style={[
                      {
                        ...styles.RSIBDelete,
                        ...selectedItemBadgeCloseIconStyle,
                      },
                    ]}>
                    {' '}
                    X{' '}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {itemsRef.current.length > 0 ? (
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                paddingHorizontal: 40,
                paddingVertical: 3,
              }}
              onPress={hideSelection}>
              <Text style={HideSelectionTextStyle ? HideSelectionTextStyle : styles.HSTextStyle}>Hide selection</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    );
  }

  function toggleModal() {
    setOpen(!open);
  }

  return (
    <Pressable onPress={() => setOpen(true)}>
      <View>
        {showMultipleAsBadge ? (
          <View style={[{ ...styles.DDPContainer, ...DropDownContainerStyle }]}>
            {sData.length > 0 ? (
              <RenderSeletedItem />
            ) : (
              <Text style={styles.PLACEHOLDER}>
                {placeholder ? placeholder : value}
              </Text>
            )}
            <Menu w="190" onClose={() => setOpen(false)} onOpen={() => setOpen(true)} isOpen={open} placement="bottom right" closeOnSelect={false} trigger={triggerProps => {
              return <Pressable style={styles.DDPressable}
                onPress={() => setOpen(!open)}
                android_ripple={{ radius, borderless }}
                accessibilityLabel="More options menu"
                {...triggerProps}>
                {dropdownIndicator == 'arrow' ? (
                  <Icon style={{ marginRight: 4 }} name={"angle-down"} size={18} />
                ) : (
                  <Text style={styles.DDDPlus}>{PLUS}</Text>
                )}
              </Pressable>;
            }}>
              {
                data.map((item, key) => {
                  return <Menu.Item key={key} onPress={() => handleListItemClick(item.value)}><ItemComponent label={item.label} value={item.value} /></Menu.Item>
                })
              }

            </Menu>

            {/* <Pressable
            style={styles.DDPressable}
            onPress={() => setOpen(!open)}
            android_ripple={{ radius, borderless }}>
            {dropdownIndicator == 'arrow' ? (
              <Icon style={{ marginRight: 4 }} name={open ? "angle-up" : "angle-down"} size={18} />
            ) : (
              <Text style={styles.DDDPlus}>{PLUS}</Text>
            )}
          </Pressable> */}
          </View>
        ) : (
          <TouchableOpacity
            style={[{ ...styles.DDPContainer, ...DropDownContainerStyle }]}
            activeOpacity={0.9}
            onPress={() => setOpen(!open)}>
            {itemsRef.current.length > 0 ? (
              <RenderSeletedItem />
            ) : (
              <Text style={styles.PLACEHOLDER}>
                {placeholder ? placeholder : value}
              </Text>)}
            <View style={styles.DDPressable}>
              {dropdownIndicator == 'arrow' ? (
                <Text style={styles.DDDArrow}>{DOWN_ARROW}</Text>
              ) : (
                <Text style={styles.DDDPlus}>{PLUS}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}

        {!showMultipleAsBadge ? <RenderBadgeBelow /> : null}

        {!searchable || !open || mode == 'MODAL' ? null : (
          <SearchBar selectedItems={selectedItems} data={data} setfilteredData={setfilteredData} />
        )}

        {/* {open ? (

        <FlatList
          style={mode == 'MODAL' ? styles.fullModeFL : undefined}
          ListHeaderComponent={
            mode == 'MODAL' ? (
              <Pressable
                style={styles.fullModalXBtnView}
                android_ripple={{ radius: 20, borderless: true, color: 'gray' }}
                onPress={toggleModal}>
                <Text style={styles.fullModalXBtnText}>X</Text>
              </Pressable>
            ) : undefined
          }
          contentContainerStyle={
            mode != 'MODAL'
              ? [{ ...styles.DDConStyle, ...flatListDefStyle }]
              : null
          }
          data={filteredData == undefined ? data : filteredData}
          renderItem={({ item, index }: ListRenderItemInfo<ItemProps>) => (
            // <></>
            <ItemComponent
              key={index.toString() + new Date().getSeconds().toString()}
              root={index}
              label={item.label}
              value={item.value}
            />
          )}
          keyExtractor={(item: ItemProps, index) =>
            index.toString() + new Date().getSeconds().toString()
          }
          scrollEnabled
        />
      ) : null
      } */}
      </View >
    </Pressable>
  );
}
