import { useState } from "react";
import { Dimensions, StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

// /**
//  * TableHeader Component
//  * @component
//  * @param {Object} props - The props object containing headers and cellSize.
//  * @param {Array.<string>} props.headers - Array of header labels.
//  * @param {Array.<number>} props.cellSize - Width of each cell in the ratio of 12.
//  * @returns {JSX.Element} - TableHeader component JSX
//  */
const TableHeader = ({ headers, cellSize }) => {
    return (
        <View
            className={
                `flex flex-row py-4 px-2 justify-between ` +
                (Dimensions.get("screen").width < 770 ? "w-[1728px]" : "")
            }
        >
            {headers?.map((head, index) => {
                return (
                    <View
                        key={index}
                        className={`flex flex-row w-${cellSize[index]}/12 justify-start`}
                    >
                        <View
                            className={`flex flex-row items-center w-full justify-start`}
                        >
                            <Text selectable className="font-semibold">
                                {head}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// /**
//  * TableRows Component
//  * @component
//  * @param {Object} props - The props object containing rows and cellSize.
//  * @param {Array.<Array.<{ content: JSX.Element }>>} props.rows - Array of rows, each containing an array of row items with content.
//  * @param {Array.<number>} props.cellSize - Width of each cell in the ratio of 12.
//  * @returns {Array.<JSX.Element>} - Array of JSX elements representing table rows
//  */
const TableRows = ({ rows, cellSize, hasActions, options }) => {
    return rows?.map((row, index) => {
        return (
            <View key={index}>
                <View
                    className={
                        `flex flex-row py-4 px-2 justify-between ` +
                        (Dimensions.get("screen").width < 770
                            ? "w-[1728px]"
                            : "")
                    }
                >
                    {row?.map((rowItem, itemIndex) => {
                        return (
                            <RowItem
                                key={rowItem.key || itemIndex}
                                width={cellSize[itemIndex]}
                                content={rowItem.content}
                                isLast={row.length - 1 === itemIndex}
                                options={options}
                                hasActions={hasActions}
                                data={row[0]?.data}
                            />
                        );
                    })}
                </View>
                {index < rows.length && (
                    <View
                        className="my-2 -z-50"
                        style={{
                            borderColor: "#e4e4e4",
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                )}
            </View>
        );
    });
};

const RowItem = ({ width, content, isLast, hasActions, options, data }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <View className={`flex flex-row relative items-center w-${width}/12`}>
            <View
                className={`flex flex-row items-center -z-9999 ${
                    hasActions && isLast ? "w-fit" : "w-full"
                } justify-start`}
            >
                {content}
            </View>
            {hasActions && isLast && (
                <Pressable
                    className="absolute right-8 w-fit"
                    onPress={toggleDropdown}
                >
                    <Icon name="dots-three-vertical" size={16} />
                </Pressable>
            )}
            {showDropdown && (
                <View className="absolute top-0 right-14 bg-white border-gray-300 border rounded shadow z-9999 cursor-pointer">
                    {options?.map((option) => {
                        return (
                            <Pressable
                                key={option.key}
                                className="p-2"
                                onPress={option.onClick(data)}
                            >
                                <Text selectable>{option.name}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

// /**
//  * DataTable Component
//  * @component
//  * @param {Object} props - The props object containing headers, rows, and cellSize.
//  * @param {Array.<string>} props.headers - Array of header labels.
//  * @param {Array.<Array.<{ content: JSX.Element }>>} props.rows - Array of rows, each containing an array of row items with content.
//  * @param {Array.<number>} props.cellSize - Width of each cell in the ratio of 12.
//  * @returns {JSX.Element} - DataTable component JSX
//  */

interface IDataTable {
    headers: any;
    rows: any;
    cellSize: any;
    className?: any;
    hasActions?: boolean;
    options?: {
        key: string;
        name: string;
        onClick: (data: any) => void;
    }[];
}

const DataTable = ({
    headers,
    rows,
    cellSize,
    className,
    hasActions,
    options,
}: IDataTable) => {
    return (
        <View className={className}>
            <TableHeader headers={headers} cellSize={cellSize} />
            <View
                className="mb-2"
                style={{
                    borderColor: "#e4e4e4",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            <TableRows
                rows={rows}
                cellSize={cellSize}
                options={options}
                hasActions={hasActions}
            />
        </View>
    );
};

export default DataTable;
