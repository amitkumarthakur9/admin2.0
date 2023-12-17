import { Badge, CheckIcon, Menu, Select } from "native-base"
import { Pressable, View, Text } from "react-native"
import { TouchableRipple } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';

export const SortingPopup = ({ setSortingOpen, setFilterOpen, sortingOpen, appliedSorting, setAppliedSorting, sorting, handleSortingChange }) => {
    return <View className="ml-1">
        <Menu w="md" onClose={() => setSortingOpen(false)} onOpen={() => { setSortingOpen(true), setFilterOpen(false) }} isOpen={sortingOpen} bgColor={"white"} placement="bottom" closeOnSelect={false} trigger={triggerProps => {
            return <Pressable className={"flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200 " + (sortingOpen ? "bg-zinc-100" : "")} accessibilityLabel="More options menu" {...triggerProps}>
                <Icon name="sort" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />
                <Text className="mr-1">Sorting</Text>
                {
                    appliedSorting.key && appliedSorting.direction && <Badge
                        height={5}
                        width={5}
                        colorScheme="danger" rounded="full" variant="solid" alignSelf="flex-end" _text={{
                            fontSize: 12,
                        }}>
                        {1}
                    </Badge>
                }
            </Pressable>
        }}>
            <Menu.Item bgColor={"white"} cancelable={false}>
                <View className="flex flex-col">
                    {appliedSorting.key && <View className="flex flex-row-reverse mb-2">
                        <TouchableRipple rippleColor={"#e4e4e4"} onPress={() => setAppliedSorting({ key: "", direction: "" })}>
                            <Text selectable className='text-xs underline underline-offset-4'>clear</Text>
                        </TouchableRipple>
                    </View>}
                    <View className="flex flex-row">
                        <View className="mr-2">
                            <Select
                                dropdownIcon={<Icon style={{ marginRight: 4 }} name="angle-down" size={18} />}
                                selectedValue={appliedSorting.key}
                                minWidth="200"
                                accessibilityLabel="By"
                                placeholder="By"
                                _selectedItem={{
                                    bg: "gray.50",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1}
                                onValueChange={itemValue => handleSortingChange(itemValue, 'key')}>
                                {
                                    sorting.map((sort, index) => <Select.Item label={sort.title} value={sort.key} />)
                                }
                            </Select>
                        </View>
                        <View>
                            {
                                appliedSorting.key != "" && <Select
                                    dropdownIcon={<Icon style={{ marginRight: 4 }} name="angle-down" size={18} />}
                                    selectedValue={appliedSorting.direction}
                                    minWidth="200"
                                    accessibilityLabel="Direction"
                                    placeholder="Direction"
                                    _selectedItem={{
                                        bg: "gray.50",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} onValueChange={itemValue => handleSortingChange(itemValue, 'direction')}>
                                    {
                                        sorting.find((sort, index) => sort.key == appliedSorting.key)?.direction?.map((direc, index) => <Select.Item label={direc.displayString} value={direc.value} />)
                                    }

                                </Select>
                            }
                        </View>
                    </View>

                </View>

            </Menu.Item>
        </Menu>
    </View>
}